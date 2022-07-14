import { useState, useEffect } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { doc, updateDoc, collection, getDocs, query, where, orderBy, deleteDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../firebase.config";
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg";
import homeIcon from "../assets/svg/homeIcon.svg";
import ListingItem from "../components/ListingItem";
import Spinner from "../components/Spinner";

const Profile = () => {
    const auth = getAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email,
    });

    const [changeDetails, setChangeDetails] = useState(false);
    const [listings, setListings] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const { name, email } = formData;

    useEffect(() => {
        const fetchUserListings = async () => {
            const listingsRef = collection(db, "listings");
            const q = query(listingsRef, where("userRef", "==", auth.currentUser.uid), orderBy("timestamp", "desc"));
            const querySnap = await getDocs(q);
            let listing = [];
            querySnap.forEach((doc) => {
                return listing.push({
                    id: doc.id,
                    data: doc.data(),
                })
            });
            setListings(listing);
            setIsLoading(false);
        }

        fetchUserListings();
    }, [auth.currentUser.uid]);

    const onLogout = () => {
        auth.signOut();
        navigate("/");
    }

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }))
    }

    const onDelete = async (listingId) => {
        if (window.confirm("Are you sure you want to delete this listing?")) {
            await deleteDoc(doc(db, "listings", listingId));
            const updatedListings = listings.filter((listing) => listing.id !== listingId);
            setListings(updatedListings);
            toast.success("Successfully delete the listing!")
        }
    }

    const onEdit = (listingId) => navigate(`/edit-listing/${listingId}`);

    const onSubmit = async () => {

        try {
            if (auth.currentUser.displayName !== name) {
                await updateProfile(auth.currentUser, {
                    displayName: name,
                });

                const userRef = doc(db, "users", auth.currentUser.uid);
                await updateDoc(userRef, {
                    name,
                })
            }
        } catch (error) {
            toast.error("Fail to update the profile. Please check!");
        }
    }

    if (isLoading) {
        return <Spinner />
    }

    return (
        <div className="">
            <header className="profileHeader">
                <p className="pageHeader">My Profile</p>
                <button className="logout" type="button" onClick={onLogout}>Logout</button>
            </header>
            <main>
                <div className="profileDetailsHeader">
                    <p className="profileDetailsText">Personal Details</p>
                    <p className="changePersonalDetails" onClick={() => {
                        changeDetails && onSubmit()
                        setChangeDetails((prevState) => !prevState)
                    }}>{changeDetails ? "Done" : "Change"}</p>
                </div>
                <div className="profileCard">
                    <form>
                        <input
                            type="text"
                            id="name"
                            className={!changeDetails ? "profileName" : "profileNameActive"}
                            disabled={!changeDetails}
                            value={name}
                            onChange={onChange}
                        />
                        <input
                            type="email"
                            id="email"
                            className={!changeDetails ? "profileEmail" : "profileEmailActive"}
                            disabled={!changeDetails}
                            value={email}
                            onChange={onChange}
                        />
                    </form>
                </div>
                <Link to="/create-listing" className="createListing">
                    <img src={homeIcon} alt="home" />
                    <p>Sell or rent your home</p>
                    <img src={arrowRight} alt="arrow right" />
                </Link>
                {!isLoading && listings?.length > 0 && (
                    <>
                        <p className="listingText">Your Listings</p>
                        <ul className="listingsList">
                            {listings.map((listing) => (
                                <ListingItem
                                    key={listing.id}
                                    listing={listing.data}
                                    id={listing.id}
                                    onDelete={() => onDelete(listing.id)}
                                    onEdit={() => onEdit(listing.id)}
                                />
                            ))}
                        </ul>
                    </>
                )}
            </main>
        </div>
    );
}

export default Profile;