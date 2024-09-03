import { useReducer, useEffect } from "react";
import { tourReducer, initialState } from "./tourReducer";
import {
  FETCH_TOURS_REQUEST,
  FETCH_TOURS_SUCCESS,
  FETCH_TOURS_FAILURE,
} from "./tourActions";
import { getTours } from "../services/tourService";
import "../assets/css/style.css";
import Loader from "./Loader";
import Error from "./Error";

function ToursList() {
  const [state, dispatch] = useReducer(tourReducer, initialState);

  useEffect(() => {
    const fetchTours = async () => {
      dispatch({ type: FETCH_TOURS_REQUEST });
      try {
        const tours = await getTours();
        dispatch({ type: FETCH_TOURS_SUCCESS, payload: tours });
      } catch (error) {
        dispatch({ type: FETCH_TOURS_FAILURE, error: error.message });
      }
    };

    fetchTours();
  }, []);

  const { tours = [], status } = state;

  return (
    <>
      {status === "loading" && <Loader />}
      {status === "error" && <Error />}
      {status === "success" && (
        <div className="main">
          {tours.length === 0 ? (
            <h2>No tours found</h2>
          ) : (
            <div className="card-container">
              {tours.map((tour) => (
                <div className="card" key={tour._id}>
                  <div className="card__header">
                    <div className="card__picture">
                      <div className="card__picture-overlay"></div>
                      <img
                        className="card__picture-img"
                        src={`/img/tours/${tour.imageCover}`}
                        alt={tour.name}
                      />
                    </div>
                    <h3 className="heading-tertirary">
                      <span>{tour.name}</span>
                    </h3>
                  </div>
                  <div className="card__details">
                    <h4 className="card__sub-heading">
                      {`${tour.difficulty} ${tour.duration}-day tour`}
                    </h4>
                    <p className="card__text">{tour.summary}</p>
                    <div className="card__data">
                      <svg className="card__icon">
                        <use xlinkHref="/img/icons.svg#icon-map-pin"></use>
                      </svg>
                      <span>{tour.startLocation.description}</span>
                    </div>
                    <div className="card__data">
                      <svg className="card__icon">
                        <use xlinkHref="/img/icons.svg#icon-calendar"></use>
                      </svg>
                      <span>
                        {new Date(tour.startDates[0]).toLocaleString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="card__data">
                      <svg className="card__icon">
                        <use xlinkHref="/img/icons.svg#icon-flag"></use>
                      </svg>
                      <span>{`${tour.locations.length} stops`}</span>
                    </div>
                    <div className="card__data">
                      <svg className="card__icon">
                        <use xlinkHref="/img/icons.svg#icon-user"></use>
                      </svg>
                      <span>{`${tour.maxGroupSize} people`}</span>
                    </div>
                  </div>
                  <div className="card__footer">
                    <p>
                      <span className="card__footer-value">${tour.price}</span>
                      <span className="card__footer-text"> per person</span>
                    </p>
                    <p className="card__ratings">
                      <span className="card__footer-value">
                        {tour.ratingsAverage}
                      </span>
                      <span className="card__footer-text">
                        {" "}
                        rating ({tour.ratingsQuantity})
                      </span>
                    </p>
                    <a
                      className="btn btn--green btn--small"
                      href={`/tour/${tour.slug}`}
                    >
                      Details
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default ToursList;
