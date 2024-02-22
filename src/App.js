import React, { useCallback, useEffect, useState } from "react";
import cx from "classnames";
import Loading from "./loading";
import axios from "axios";
import { Waypoint } from "react-waypoint";
import Fake from "./fake";
import "./App.css";

const LayoutList = 0;
const LayoutGrid = 1;
const PerPage = 30;
const ClientID =
  "47da73da2b740608b32dd1d201e72606000e8db1df885e6f2c72843cddca23a8";

function App() {
  const [layout, setlayout] = useState(LayoutList);
  const [photos, setPhotos] = useState([]);
  const [showLoading, setShowLoading] = useState(true);
  const [zoominImage, setZoominImage] = useState("");
  const [page, setPage] = useState(1);

  const fetchData = useCallback(() => {
    // setShowLoading(false);
    // setPhotos([...photos, ...Fake]);
    // return;
    (async () => {
      const res = await axios({
        method: "get",
        url: "https://api.unsplash.com/photos",
        params: {
          page: page,
          per_page: PerPage,
          client_id: ClientID,
        },
      });
      setPage((page) => page++);
      if (res?.data) {
        setShowLoading(false);
        console.log("res?.data: ", res?.data);
        setPhotos([...photos, ...(res?.data || [])]);
      }
    })();
  }, [page]);

  useEffect(() => {
    // setState({
    //   showLoading: false,
    //   photos: photos.concat(Fake),
    // })
    // return
    fetchData();
  }, [fetchData]);

  const changeLayout = (layout) => {
    setlayout(layout);
  };

  const renderImage = (photo, index) => {
    // make sure we only fetch once, cause WayPoint onEnter will
    // be trigged many times
    let hasFetched = false;
    console.log("photo.id: ", photo.id);
    return (
      <div key={photo.id} className="gallery__photo-wrapper">
        <div
          className="gallery__photo-container"
          style={{
            paddingBottom: (photo.height / photo.width) * 100 + "%",
          }}
        >
          <img className="gallery__photo" src={photo.urls.regular} />

          <div
            onClick={() => setZoominImage(photo.urls.full)}
            className="gallery__photo-hover"
          />

          {index === photos.length - 6 ? (
            <Waypoint
              onEnter={() => {
                console.log("onEnter: ");
                if (hasFetched) return;
                hasFetched = true;
                setShowLoading(true);
                fetchData();
              }}
            />
          ) : null}
        </div>

        <div className="gallery__photo-info">
          <div className="gallery__photo-info__like">
            <i className="fa fa-heart" />
            <span>{photo.likes}</span>
          </div>

          <a
            target="_blank"
            href={photo.user.links.html}
            className="gallery__photo-info__person"
          >
            {photo.user.name}
          </a>

          <a
            href={photo.urls.raw}
            download={true}
            className="gallery__photo-info__download"
          >
            <i className="fa fa-arrow-down" />
          </a>
        </div>
      </div>
    );
  };

  const renderGrid = () => {
    const data1 = photos.filter((d, i) => i % 3 === 0);
    console.log("data1: ", data1);
    const data2 = photos.filter((d, i) => i % 3 === 1);
    const data3 = photos.filter((d, i) => i % 3 === 2);
    return (
      <div className="gallery__grid-photos">
        <div className="gallery__grid-photos__grid">
          {data1.map((photo, index) => renderImage(photo, index * 3))}
        </div>
        <div className="gallery__grid-photos__grid">
          {data2.map((photo, index) => renderImage(photo, index * 3 + 1))}
        </div>
        <div className="gallery__grid-photos__grid">
          {data3.map((photo, index) => renderImage(photo, index * 3 + 2))}
        </div>
      </div>
    );
  };

  const renderList = () => {
    return (
      <div className="gallery__list-photos">{photos.map(renderImage)}</div>
    );
  };

  return (
    <div className="gallery">
      <div
        className={cx("gallery__zoomin", {
          "gallery__zoomin--hide": zoominImage.length === 0,
        })}
        style={{
          backgroundImage: `url(${zoominImage})`,
        }}
        onClick={() => setZoominImage("")}
      />

      <h1 className="gallery__header">My Unsplash Gallery</h1>

      <div className="gallery__layout">
        <svg
          onClick={() => changeLayout(LayoutList)}
          className={cx("gallery__layout__btn", {
            "gallery__layout__btn--active": layout === LayoutList,
          })}
          version="1.1"
          viewBox="0 0 32 32"
          width="32"
          height="32"
          aria-labelledby="icon-title-4721 icon-desc-4722"
          aria-hidden="false"
          data-reactid=".rwftimv01s.0.4.0.3.0.1.$single.0"
        >
          <path
            d="M30 14c1.1 0 2-.9 2-2v-10c0-1.1-.9-2-2-2h-28c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2m0 18c-1.1 0-2-.9-2-2v-10c0-1.1.9-2 2-2h28c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2"
            data-reactid=".rwftimv01s.0.4.0.3.0.1.$single.0.1"
          ></path>
        </svg>
        <svg
          onClick={() => changeLayout(LayoutGrid)}
          className={cx("gallery__layout__btn", {
            "gallery__layout__btn--active": layout === LayoutGrid,
          })}
          version="1.1"
          viewBox="0 0 32 32"
          width="32"
          height="32"
          aria-labelledby="icon-title-4723 icon-desc-4724"
          aria-hidden="false"
          data-reactid=".rwftimv01s.0.4.0.3.0.1.$multi.0"
        >
          <path
            d="M0 2v10c0 1.106 0.896 2 2 2h10c1.104 0 2-0.894 2-2v-10c0-1.106-0.896-2-2-2h-10c-1.104 0-2 0.894-2 2zM2 18c-1.104 0-2 0.894-2 2v10c0 1.106 0.896 2 2 2h10c1.104 0 2-0.894 2-2v-10c0-1.106-0.896-2-2-2h-10zM20 18c-1.106 0-2 0.894-2 2v10c0 1.106 0.894 2 2 2h10c1.106 0 2-0.894 2-2v-10c0-1.106-0.894-2-2-2h-10zM20 0c-1.106 0-2 0.894-2 2v10c0 1.106 0.894 2 2 2h10c1.106 0 2-0.894 2-2v-10c0-1.106-0.894-2-2-2h-10z"
            data-reactid=".rwftimv01s.0.4.0.3.0.1.$multi.0.1"
          ></path>
        </svg>
      </div>

      {layout === LayoutList ? renderList() : renderGrid()}

      {showLoading ? <Loading /> : null}
    </div>
  );
}

export default App;
