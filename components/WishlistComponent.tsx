import { ref } from 'firebase/database';
import { useObjectVal } from 'react-firebase-hooks/database'
import { database as db } from '../firebase/clientApp';
import type { ShareWishlist } from '../types';

const WishlistComponent = ({ wishlistId }) => {
  const wishlistPath = `/wishlists/${wishlistId}`
  const [wishList, loading, error] = useObjectVal<ShareWishlist.Wishlist>(ref(db, wishlistPath))

  return (
    <>
      {error && `Error: ${error}`}
      {loading && 'Loading...'}
      {wishList && JSON.stringify(wishList)}
    </>
  )
}

export default WishlistComponent
