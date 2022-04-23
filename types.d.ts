export declare namespace ShareWishlist {
  export type Schema = {
    users: Record<UserId, User>
    wishlists: Record<WishlistId, Wishlist>
    shortPathMap: Record<ShortPath, Path>
  }

  export type UserId = string
  export type WishlistId = string
  export type ItemId = string
  export type ShortPath = string
  export type Role = 'owner'

  export type User = {
    id: UserId
  }

  export type Wishlist = {
    id: WishlistId
    roles: Record<UserId, Role>
    items: Item[]
    shortPath?: ShortPath
  }

  export type Item = {
    id: ItemId
    name: string
    status: 'open' | 'reserved' | 'closed'
  }

  export type Path = {
    id: ShortPath
    wishlistId: WishlistId
  }
}
