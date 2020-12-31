import React from "react";
import Tweet from "../../components/Tweet";
import SocketClient from "../../socketClient";
import { sentiments } from "../../helpers/utils";

const Feed = () => {
  const [tweets, setTweets] = React.useState([]);

  React.useEffect(() => {
    fetch(`${process.env.REACT_APP_API_KEY}/tweets`)
      .then((response) => response.json())
      .then((response) => {
        setTweets(response);
      });

    SocketClient.connect({
      url: "http://localhost:3001",
      onData: (data) => {
        setTweets((prevState) => {
          return [data, ...prevState];
        });
      },
    });
  }, []);

  return (
    <div className="flex">
      <div className="w-1/3 p-4 border-r border-gray-600">
        <p>Colors</p>
        <div className="flex flex-wrap">
          {Object.keys(sentiments).map((key) => (
            <div
              className="p-1 my-1 mr-2 text-xs"
              style={{ background: sentiments[key].background }}
            >
              {key}
            </div>
          ))}
        </div>
        <p>Tweets: {tweets.length}</p>
      </div>
      <div className="w-2/3 px-4">
        <div className="h-screen overflow-auto">
          {tweets.map((tweet) => (
            <Tweet key={tweet.id} tweet={tweet} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feed;
