import { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";

const Offers = () => {
    const [listings, setListings] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const listingRef = collection(db, "listings");
                const q = query(
                    listingRef,
                    where("offer", "==", true),
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
    }, []);

    return (
        <div className="offers">
            <header>
                <p className="pageHeader">
                    Offers
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
                <p>No Current Offers</p>
            )}
        </div>
    );
}

export default Offers;