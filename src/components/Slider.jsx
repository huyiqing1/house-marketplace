import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDoc, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../firebase.config";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import Spinner from "./Spinner";

const Slider = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [listing, setListing] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchListings = async () => {
            const listingRef = collection(db, "listings");
            const q = query(listingRef, orderBy("timestamp", "desc"), limit(5));
            const querySnap = await getDocs(q);
            let listings = [];
            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data(),
                })
            });
            setListing(listings);
            setIsLoading(false);
        }

        fetchListings();
    }, []);

    if (isLoading) {
        return <Spinner />;
    }

    if (listing.length === 0) {
        return <></>;
    }

    return (
        listing && (
            <div className="slider">
                <p className="exploreHeading">Recommended</p>
                <Swiper
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    modules={[Navigation, Pagination, Scrollbar, A11y]}
                    navigation
                >
                    {listing.map(({ data, id }) => (
                        <SwiperSlide
                            key={id}
                            onClick={() => navigate(`/category/${data.type}/${id}`)}
                        >
                            <div
                                className="swiperSlideDiv"
                                style={{
                                    background: `url(${data.imgUrls[0]}) center no-repeat`,
                                    backgroundSize: "cover",
                                    height: "400px"
                                }}
                            >
                                <p className="swiperSlideText">{data.name}</p>
                                <p className="swiperSlidePrice">$
                                    {data.offer ? data.discountPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : data.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    {data.type === "rent" && " / Month"}
                                </p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        )
    );
}

export default Slider;