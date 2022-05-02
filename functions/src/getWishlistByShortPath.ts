import { https } from 'firebase-functions'
import { database } from 'firebase-admin'
import type { ShareWishlist } from '../../types'

type ReqData = ShareWishlist.Functions.GetWishlistByShortPath.RequestData
type ResData = ShareWishlist.Functions.GetWishlistByShortPath.ResponseData

export const getWishlistByShortPath = https.onCall(async (data: ReqData): Promise<ResData | null> => {
  const shortPath = data.shortPath
  console.debug('shortPath', shortPath)
  if (!shortPath) {
    throw new https.HttpsError('invalid-argument', 'Invalid/Expired short path!')
  }

  const db = database()
  const wishlistIdSnapshot = await db.ref(`/shortPaths/${shortPath}/wishlistId`).get()
  if (!wishlistIdSnapshot.exists()) {
    throw new https.HttpsError('failed-precondition', 'Invalid/Expired short path!')
  }
  const wishlistId = wishlistIdSnapshot.val()
  console.debug('wishlistId', wishlistId)

  const wishlistSnapshot = await db.ref(`/wishlists/${wishlistId}`).get()
  if (!wishlistSnapshot.exists()) {
    throw new https.HttpsError('failed-precondition', 'Invalid wishlist!')
  }
  const wishlist = wishlistSnapshot.val()
  console.debug('wishlist', wishlist)
  return { wishlist }
})
