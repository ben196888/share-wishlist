# Firestore

```ts
type Schema = {
  users: Record<UserId, User>
  wishlists: Record<WishlistId, Wishlist>
  shortPaths: Record<ShortPath, Path>
}

type UserId = string
type WishlistId = string
type ItemId = string
type ShortPath = string
type Role = 'owner'

type User = {
  id: UserId
}

type Wishlist = {
  id: WishlistId
  roles: Record<UserId, Role>
  items: Item[]
  shortPath?: ShortPath
}

type Item = {
  id: itemId
  name: string
}

type Path = {
  id: ShortPath
  wishlistId: WishlistId
}
```

JSON format

```js
{
  users: {
    [userId]: {
      id: userId
    }
  },
  wishlists: {
    [wishlistId]: {
      id: WishlistId
      roles: {
        [userId]: 'owner'
      },
      shortPath: ShortPath,
      items: [{ id: itemId, name: string }]
    }
  },
  shortPaths: {
    [shortPath]: {
      id: shortPath
      wishlistId: wishlistId
    }
  }
}
```
