import SilverIcon from "@/assets/icons/silver.icon";

type Props = {
  avatar: string;
  name: string;
  subscriptionPlan: string;
};

export const UserCenter = ({ avatar, name, subscriptionPlan }: Props) => {
  return (
    <div className="flex w-3/5 gap-4 mx-4 mt-3">
      <img src={avatar} alt="avatar" className="h-20 rounded-full" />
      <div className="flex flex-col justify-center">
        <p className="text-neutral-600 text-sm font-normal">Welcome,</p>
        <p className="text-neutral-900 text-lg font-bold pt-[-5px]">{name}</p>
        <div className="flex items-center gap-2 text-white font-bold bg-slate-400 px-2 rounded-full mt-1">
          <SilverIcon className="bg-white w-4 h-4 rounded-full"/>
          <span >
            {subscriptionPlan} Plan
          </span>
        </div>
      </div>
    </div>
  );
};
