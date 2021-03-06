import moment from "moment";
import { sentiments } from "../../helpers/utils";

const Tweet = ({ tweet }) => {
  return (
    <div
      className="my-4 rounded"
      style={{ background: sentiments[tweet.sentiment].background }}
    >
      <div className="flex p-4 pb-0">
        <div className="flex items-center">
          <img
            className="w-10 h-10 rounded-full"
            src={
              tweet && tweet.user && tweet.user.profileImageUrlHttps
                ? tweet.user.profileImageUrlHttps
                : "https://picsum.photos/200"
            }
            alt=""
          />
          <div className="ml-3">
            <p className="text-base leading-6">
              <span className="text-sm text-gray-400">
                {tweet && tweet.user && tweet.user.screenName
                  ? tweet.user.screenName
                  : "-"}{" "}
                &bull; {moment(tweet.createdAt).format("DD/MM/YYYY HH:mm")}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="p-4">
        <p className="text-base text-justify text-white">{tweet.fullText}</p>
      </div>
    </div>
  );
};

export default Tweet;
