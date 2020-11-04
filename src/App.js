import React from "react";
import SocketClient from "./socketClient";
import Layout from "./components/Layout";
import Tweet from "./components/Tweet";
import { sentiments } from "./helpers/utils";
import "./tailwind.output.css";

function App() {
  const [tweets, setTweets] = React.useState([]);

  React.useEffect(() => {
    SocketClient.connect({
      url: "http://localhost:3001",
      onData: (data) => {
        console.log(data);
        setTweets((prevState) => [...prevState, data]);
      },
    });
  }, []);

  return (
    <Layout>
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
    </Layout>
  );
}

export default App;
