import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@/components/store/store";
import Button from "@/components/ui/Button";
import FeeSlider from "@/components/ui/feeSlider";
import { changeFee, fatchFee } from "@/reducer/feeSlice";
import ShowConfirmation from "@/components/Com/adminCom/ShowConfirmation";

const FeePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { history, status } = useSelector((state: RootState) => state.fee);
  const [value, setValue] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    dispatch(fatchFee());
  }, [dispatch]);

  useEffect(() => {
    if (history.length > 0) {
      setValue(history[0].fee);
    }
  }, [history]);

  async function changeingFee() {
    setLoading(true);
    try {
      await dispatch(changeFee(value * 10));
    } catch (error: any) {
      console.warn("failed to changing fee", error?.message);
      setShowConfirmation(false);
    } finally {
      setLoading(false);
      setShowConfirmation(false);
    }
  }

  return (
    <section className="mt-5 w-full flex flex-col 2xl:grid 2xl:items-center 2xl:grid-cols-3 gap-6 rounded-lg p-6">
      {/* LEFT COLUMN — Current Fee & Management */}
      <div className="col-span-2 flex flex-col gap-6">
        {/* ---- Current Fee ---- */}
        <div className="flex flex-col items-center justify-between bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
          <div className="text-center">
            <p className="text-gray-300 text-sm uppercase tracking-wide">
              Current Marketplace Fee
            </p>
            <h2 className="text-5xl font-extrabold text-blue-400 mt-2">
              {history[0]?.fee ?? 0}%
            </h2>
          </div>

          {/* (Optional) Fee Trend Chart */}
          {/* <FeeChart data={history} /> */}
        </div>

        {/* ---- Fee Management ---- */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-white mb-4">Fee Management</h1>
          <div className="flex flex-col justify-center gap-3 items-center w-full">
            {/* Preset Buttons */}
            <div className="w-full flex flex-wrap justify-around  gap-3">
              {[2.5, 5, 7.5, 10].map((preset) => (
                <button
                  key={preset}
                  className={`p-2 w-[80px] text-white rounded-lg font-semibold transition-all duration-200 ${
                    value === preset
                      ? "bg-blue-900 shadow-lg"
                      : "bg-blue-600 hover:bg-blue-500"
                  }`}
                  onClick={() => setValue(preset)}
                  disabled={loading}
                >
                  {preset}%
                </button>
              ))}
            </div>

            {/* Slider */}
            <FeeSlider value={value} setValue={setValue} />

            {/* Update Button */}
            <Button
              title={loading ? "Updating..." : "Update"}
              handleClick={() => {
                if (value === history[0]?.fee) {
                  alert("This fee is already active.");
                } else {
                  setShowConfirmation(true);
                }
              }}
              othercss={`mt-2 py-2 px-5 text-white rounded-lg shadow-lg transition-colors duration-200 ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-500"
              }`}
              loading={loading}
            />
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN — Fee History */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg 2xl:h-fit transition-all duration-300 flex flex-col items-start">
        <h1 className="text-2xl font-bold text-white mb-4">Fee History</h1>
        {status === "idle" ? (
          <p className="text-gray-400">Loading...</p>
        ) : history.length === 0 ? (
          <div className="p-6 text-center text-gray-400 border border-gray-600 rounded-lg w-full">
            No fee history yet. Updates will appear here.
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-1 2xl:place-items-center gap-6 w-full">
            {history.map((i, idx) => (
              <li
                key={idx}
                className="relative pl-3 border-l-2 border-gray-600 animate-fadeIn"
              >
                <span className="absolute -left-[7px] top-2 w-3 h-3 bg-blue-500 rounded-full" />
                <p className="text-white font-medium">
                  Fee changed to{" "}
                  <span className="text-blue-400 font-bold">{i.fee}%</span>
                </p>
                <span className="text-gray-400 text-sm">
                  {new Date(i.updateAt as string).toLocaleString("en-GB", {
                    timeZone: "UTC",
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  UTC
                </span>
                {i.txHash && (
                  <p className="text-sm text-gray-400 mt-1">
                    Tx:{" "}
                    <a
                      href={`https://bscscan.com/tx/${i.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 underline"
                    >
                      {i.txHash.slice(0, 10)}...
                    </a>
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ---- Confirmation Dialog ---- */}
      {showConfirmation && (
        <ShowConfirmation
          loading={loading}
          value={value}
          setShowConfirmation={setShowConfirmation}
          handleClick={changeingFee}
        />
      )}
    </section>
  );
};

export default FeePage;
