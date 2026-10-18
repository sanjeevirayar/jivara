import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";


const WishlistContext =
  createContext(null);


const STORAGE_KEY =
  "jivara-wishlist";


export function WishlistProvider({
  children,
}) {

  const [
    wishlist,
    setWishlist,
  ] = useState(() => {

    try {

      const saved =
        localStorage.getItem(
          STORAGE_KEY
        );


      return saved
        ? JSON.parse(saved)
        : [];

    } catch {

      return [];

    }

  });


  /* =====================================================
     SAVE TO LOCAL STORAGE
  ===================================================== */

  useEffect(() => {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        wishlist
      )
    );

  }, [wishlist]);


  /* =====================================================
     CHECK IF PRODUCT IS WISHLISTED
  ===================================================== */

  const isWishlisted =
    (productId) => {

      return wishlist.some(
        (item) =>
          String(item.id) ===
          String(productId)
      );

    };


  /* =====================================================
     ADD
  ===================================================== */

  const addToWishlist =
    (product) => {

      setWishlist(
        (current) => {

          const exists =
            current.some(
              (item) =>
                String(item.id) ===
                String(product.id)
            );


          if (exists) {
            return current;
          }


          return [
            ...current,

            {
              id:
                product.id,

              slug:
                product.slug,

              name:
                product.name,

              category:
                product.category,

              collectionId:
                product.collectionId,

              price:
                product.price,

              currency:
                product.currency ||
                "INR",

              image:
                product.image ||
                product.images?.[0] ||
                "",
            },
          ];

        }
      );

    };


  /* =====================================================
     REMOVE
  ===================================================== */

  const removeFromWishlist =
    (productId) => {

      setWishlist(
        (current) =>
          current.filter(
            (item) =>
              String(item.id) !==
              String(productId)
          )
      );

    };


  /* =====================================================
     TOGGLE
  ===================================================== */

  const toggleWishlist =
    (product) => {

      if (
        isWishlisted(
          product.id
        )
      ) {

        removeFromWishlist(
          product.id
        );

        return false;

      }


      addToWishlist(
        product
      );

      return true;

    };


  /* =====================================================
     CLEAR
  ===================================================== */

  const clearWishlist =
    () => {

      setWishlist([]);

    };


  /* =====================================================
     VALUE
  ===================================================== */

  const value =
    useMemo(
      () => ({
        wishlist,

        wishlistCount:
          wishlist.length,

        isWishlisted,

        addToWishlist,

        removeFromWishlist,

        toggleWishlist,

        clearWishlist,
      }),
      [wishlist]
    );


  return (
    <WishlistContext.Provider
      value={value}
    >
      {children}
    </WishlistContext.Provider>
  );

}


export function useWishlist() {

  const context =
    useContext(
      WishlistContext
    );


  if (!context) {

    throw new Error(
      "useWishlist must be used inside WishlistProvider."
    );

  }


  return context;

}