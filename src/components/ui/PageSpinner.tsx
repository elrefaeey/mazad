import { ImSpinner8 } from "react-icons/im";

function PageSpinner({ fullPage }: { fullPage?: boolean }) {
  return (
    <div
      className={`${
        fullPage ? "h-[calc(100vh_-_200px)]" : "h-full"
      } flex items-center justify-center `}
    >
      <ImSpinner8 className="text-3xl animate-spin text-[#285240]" />
    </div>
  );
}

export default PageSpinner;
