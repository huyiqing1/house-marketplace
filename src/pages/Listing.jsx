import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase.config";
import Spinner from "../components/Spinner";
import shareIcon from "../assets/svg/shareIcon.svg";

const Listing = () => {
    const [listing, setListing] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [shareLinkCopied, setShareLinkCopied] = useState(false);

    const navigate = useNavigate();
    const params = useParams();
    const auth = getAuth();
    useEffect(() => {
        const fetchListing = async () => {
            const docRef = doc(db, "listings", params.listingId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setListing(docSnap.data());
                setIsLoading(false);
            }
        }

        fetchListing();
    }, [params.listingId]);

    if (isLoading) {
        return <Spinner />;
    }
    return (
        <div className="listing">
            <main>

                <div className="shareIconDiv" onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    setShareLinkCopied(true);
                    setTimeout(() => {
                        setShareLinkCopied(false);
                    }, 2000);
                }}>
                    <img src={shareIcon} alt="" />
                </div>
                {shareLinkCopied && <p className="linkCopied">Link Copied!</p>}
                <div className="listingDetails">
                    <p className="listingName">
                        {listing.name} - $
                        {listing.offer ?
                            listing.discountPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            : listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    </p>
                    <p className="listingLocation">{listing.location}</p>
                    <p className="listingType">For {listing.type === "rent" ? "Rent" : "Sale"}</p>
                    {listing.offer && (
                        <p className="discountPrice">$
                            {listing.regularPrice - listing.discountPrice} discount
                        </p>
                    )}
                    <ul className="listingDetailsList">
                        <li>
                            {listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : "1 Bedroom"}
                        </li>
                        <li>
                            {listing.bathrooms > 1 ? `${listing.bathrooms} Bathrooms` : "1 Bathroom"}
                        </li>
                        <li>
                            {listing.parking && "Parking Spot"}
                        </li>
                        <li>
                            {listing.furnished && "Furnished"}
                        </li>
                        <p className="listingLocationTitle">Location</p>
                        {auth.currentUser?.uid !== listing.userRef && <Link to={`/contact/${listing.userRef}?listingName=${listing.name}`} className="primaryButton">Contact Landlord</Link>}
                    </ul>
                </div>
            </main>
        </div>
    );
}

export default Listing;