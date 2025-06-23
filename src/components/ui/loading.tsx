export default function SpinningLoader() {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="w-10 h-10 border-4 border-mainYellow border-t-transparent rounded-full animate-spin" />
    </div>
  );
}