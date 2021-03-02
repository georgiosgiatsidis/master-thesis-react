import React, { useState } from "react";
import Tweet from "../../components/Tweet";
import RaceChart from "../../components/RaceChart";
import SocketClient from "../../socketClient";
import { sentiments } from "../../helpers/utils";

const Feed = () => {
  const [tweets, setTweets] = React.useState([]);

  const [topHashtags, setTopHashtags] = useState([]);
  window.hashtags = topHashtags;

  React.useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/tweets`)
      .then((response) => response.json())
      .then((response) => {
        setTweets(response);
      });

    SocketClient.connect({
      url: process.env.REACT_APP_NODELDS_WS,
      onData: (data) => {
        setTweets((prevState) => {
          return [data, ...prevState];
        });
      },
      onTopHashtags: (data) => {
        setTopHashtags(data);
      },
    });
  }, []);

  return (
    <React.Fragment>
      <div className="flex">
        <div className="w-1/3 p-4 border-r border-gray-600">
          <p className="text-white">Sentiment Colors</p>
          <div className="flex flex-wrap">
            {Object.keys(sentiments).map((key) => (
              <div
                key={key}
                className="p-1 my-1 mr-2 text-xs text-white"
                style={{ background: sentiments[key].background }}
              >
                {sentiments[key].label}
              </div>
            ))}
          </div>
          <p className="text-white">Tweets: {tweets.length}</p>
        </div>
        <div className="w-2/3 px-4">
          <div className="h-screen overflow-auto">
            {tweets.map((tweet) => (
              <Tweet key={tweet.id} tweet={tweet} />
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <RaceChart data={topHashtags} />
      </div>
    </React.Fragment>
  );
};

export default Feed;
