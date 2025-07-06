import nfImg from "../assets/nf-img.png";

const NothingToSee = () => {
  return (
    <div className="flex flex-col items-center justify-center h-96 w-full bg-white rounded-3xl border border-gray-200 shadow-md p-8 text-center animate-fade-in">
      <img
        src={nfImg}
        alt="Nothing to see"
        className="w-28 h-28 mb-6 opacity-80"
      />
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Nothing to see here
      </h2>
      <p className="text-gray-500 text-sm max-w-xs">
        You're all caught up. Come back later for more.
      </p>
    </div>
  );
};

export default NothingToSee;
