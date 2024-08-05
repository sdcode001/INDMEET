import MeetingTypeList from '@/components/MeetingTypeList';

const Home = () => {


  return (
    <section className="flex size-full flex-col gap-5 text-white">
      <div className="flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11">
          Where ideas meet action. Lets make every moment count with INDMEET
      </div>

      <MeetingTypeList />
    </section>
  );
};

export default Home;
