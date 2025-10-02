import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ShowConfirmation from "@/components/adminCom/ShowConfirmation";
import { AppDispatch, RootState } from "@/components/store/store";
import Button from "@/components/ui/Button";
import FeeSlider from "@/components/ui/feeSlider";
import { changeFee, fatchFee } from "@/reducer/feeSlice";

const FeePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { history, status } = useSelector((state: RootState) => state.fee);
  const [value, setValue] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
      dispatch(fatchFee());
  }, [ dispatch]);

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
    <section className="feeSection">
    {/* ---- Current Fee ---- */}
    <div className="innerFeeSection text-center mb-6">
      <p className="text-gray-300">Current Marketplace Fee</p>
      <h2 className="text-3xl font-bold text-blue-400">
        {history[0]?.fee ?? 0}%
      </h2>
    </div>

    {/* ---- Fee Management ---- */}
    <div className="innerFeeSection">
      <h1 className="feeSection_heading">Fee Management</h1>
      <div className="flex flex-col justify-center gap-3 items-center">
        {/* Preset Buttons */}
        <div className="w-full flex items-center justify-around gap-2">
          {[2.5, 5, 7.5, 10].map((preset) => (
            <button
              key={preset}
              className={`p-2 text-white rounded-lg font-semibold transition-colors duration-200 ${
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
          othercss={`py-2 px-4 text-white rounded-lg shadow-lg transition-colors duration-200 ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-500"
          }`}
          loading={loading}
        />
      </div>
    </div>

    {/* ---- Fee History ---- */}
    <div className="innerFeeSection">
      <h1 className="feeSection_heading">Fee History</h1>

      {status === "idle" ? (
        <p className="text-gray-400">Loading...</p>
      ) : history.length === 0 ? (
        <div className="p-6 text-center text-gray-400 border border-gray-600 rounded-lg">
          No fee history yet. Updates will appear here.
        </div>
      ) : (
        <ul className="space-y-4">
          {history.map((i, idx) => (
            <li
              key={idx}
              className="relative pl-6 border-l-2 border-gray-600 animate-fadeIn"
            >
              {/* Timeline Dot */}
              <span className="absolute -left-[6px] top-2 w-3 h-3 bg-blue-500 rounded-full" />

              {/* Fee Change */}
              <p className="text-white font-medium">
                Fee changed to{" "}
                <span className="text-blue-400 font-bold">{i.fee}%</span>
              </p>

              {/* Timestamp */}
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

              {/* Transaction Hash */}
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
