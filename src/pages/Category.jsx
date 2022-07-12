import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";

const Category = () => {
    const [listings, setListings] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const params = useParams();

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const listingRef = collection(db, "listings");
                const q = query(
                    listingRef,
                    where("type", "==", params.categoryName),
                    orderBy("timestamp", "desc"),
                    limit(10)
                );

                const querySnap = await getDocs(q);

                const listing = [];
                querySnap.forEach((doc) => {
                    return listing.push({
                        id: doc.id,
                        data: doc.data(),
                    })
                });

                setListings(listing);
                setIsLoading(false);
            } catch (error) {
                toast.error("Could not get the listings. Please try again!");
            }
        }
        fetchListings();
    }, [params.categoryName]);

    return (
        <div className="category">
            <header>
                <p className="pageHeader">
                    {params.categoryName === "rent" ? "Places for rent" : "Places for sale"}
                </p>
            </header>
            {isLoading && <Spinner />}
            {!isLoading && (listings && listings.length > 0) ? (
                <main>
                    <ul className="categoryListings">
                        {listings.map((listing) => (
                            <ListingItem listing={listing.data} id={listing.id} key={listing.id} />
                        ))}
                    </ul>
                </main>
            ) : (
                !isLoading && <p>No Listings for {params.categoryName} </p>
            )}
        </div>
    );
}

export default Category;