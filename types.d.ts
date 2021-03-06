export declare namespace ShareWishlist {
  export type Schema = {
    users: Record<UserId, User>
    wishlists: Record<WishlistId, Wishlist>
    shortPaths: Record<ShortPath, Path>
  }

  export type UserId = string
  export type WishlistId = string
  export type Title = string
  export type ItemId = string
  export type ShortPath = string
  export type Role = 'owner'

  export type User = {
    id: UserId
  }

  export type Wishlist = {
    id: WishlistId
    title: Title
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

  export namespace Functions {
    export namespace CreateWishlistShortPath {
      export type RequestData = {
        wishlistId: WishlistId
        retries?: number
      }
      export type ResponseData = {
        shortPath: ShortPath
      }
    }

    export namespace GetWishlistByShortPath {
      export type RequestData = {
        shortPath: ShortPath
      }
      export type ResponseData = {
        wishlist: Wishlist
      }
    }
  }
}
