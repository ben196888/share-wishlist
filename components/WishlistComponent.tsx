import { ref } from 'firebase/database';
import { useObjectVal } from 'react-firebase-hooks/database'
import { useReadLocalStorage } from 'usehooks-ts';
import { database as db } from '../firebase/clientApp';
import type { ShareWishlist } from '../types';
import Wishlist from './Wishlist/Wishlist';

const WishlistComponent = ({ wishlistId }) => {
  const wishlistPath = `/wishlists/${wishlistId}`
  const [wishlist, loading, error] = useObjectVal<ShareWishlist.Wishlist>(ref(db, wishlistPath))

  console.log('wishlist id', wishlistId)

  const wishlistIdLocal = useReadLocalStorage<ShareWishlist.WishlistId>('wishlistId')
  const isEditable = wishlistIdLocal === wishlistId

  return (
    <>
      {error && `Error: ${error}`}
      {loading && 'Loading...'}
      {wishlist && <Wishlist wishlist={wishlist} isEditable={isEditable} />}
    </>
  )
}

export default WishlistComponent
