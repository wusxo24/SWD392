const StartupScreen = () => {
  return (
    <div className="bg-sky-100 h-screen w-screen flex justify-center items-center overflow-hidden">
      <div className="absolute w-[357px] h-[361px] left-[-151px] top-[-96px] bg-[rgba(13,191,255,0.6)] blur-[135px]" />
      <div className="absolute w-[357px] h-[361px] right-[0px] bottom-[-200px] bg-[rgba(13,191,255,0.6)] blur-[135px]" />
      <div className="text-lg font-bold">Hello FCare</div>
    </div>
  );
};

export default StartupScreen;
