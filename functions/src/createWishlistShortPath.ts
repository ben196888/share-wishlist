import { https } from 'firebase-functions'
import { database } from 'firebase-admin'
import type { ShareWishlist } from '../../types'

type ReqData = ShareWishlist.Functions.CreateWishlistShortPath.RequestData
type ResData = ShareWishlist.Functions.CreateWishlistShortPath.ResponseData

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

const randomPath = (length = 8) => {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += CHARS.charAt(Math.floor(Math.random() * CHARS.length))
  }

  return result
}

export const createWishlistShortPath = https.onCall(async (data: ReqData): Promise<ResData | null> => {
  const { wishlistId, retries = 5 } = data
  console.debug('wishlistId', wishlistId)
  if (!wishlistId) {
    throw new https.HttpsError('invalid-argument', 'Invalid/Expired wishlist id!')
  }

  const db = database()
  const wishlistRef = db.ref(`/wishlists/${wishlistId}`)
  const wishlistSnapshot = await wishlistRef.get()
  if (!wishlistSnapshot.exists()) {
    throw new https.HttpsError('failed-precondition', 'Invalid/Expired short path!')
  }
  const shortPathSnapshot = await wishlistRef.child('shortPath').get()
  if (shortPathSnapshot.exists()) {
    throw new https.HttpsError('failed-precondition', 'Shortpath has been created.')
  }

  const withRetries = <T = any>(retries: number, callback: () => T): () => T => {
    const callbackWithRetries = () => {
      let error = null
      for (let i = 0; i < retries; i++) {
        try {
          return callback()
        } catch (err) {
          error = err
        }
      }
      console.debug('with retries failed on function ' + callback.name)
      throw error
    }
    return callbackWithRetries
  }

  const generateShortPath = async (): Promise<string> => {
    const shortPath = randomPath()
    console.debug('shortPath', shortPath)
    const shortPathSnapshot = await db.ref(`/shortPaths/${shortPath}`).get()
    if (shortPathSnapshot.exists()) {
      throw new https.HttpsError('out-of-range', 'Shortpath has collision!')
    }
    return shortPath
  }

  const generateShortPathWithRetries = withRetries(retries, generateShortPath)
  const shortPath = await generateShortPathWithRetries();

  await db.ref('shortPaths').child(shortPath).set({ id: shortPath, wishlistId })
  await db.ref(wishlistSnapshot.ref).update({ shortPath })

  return { shortPath }
})
