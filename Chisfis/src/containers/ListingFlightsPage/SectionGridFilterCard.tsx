import React, { FC,useEffect,useState } from "react";
import TabFilters from "./TabFilters";
import Heading2 from "components/Heading/Heading2";
import FlightCard, { FlightCardProps } from "components/FlightCard/FlightCard";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import { Resource } from "types";
import { Offer, Order } from '@duffel/api';
import { SearchCard } from "./SearchCard";
import { BookingCard } from "./BookingCard";
import { ConfirmationCard } from "./ConfirmationCard";
import fetchOffers from "components/HeroSearchForm/(flight-search-form)/FlightSearchForm"
import { GENERIC_ERROR_MESSAGE } from "./constants";
export interface SectionGridFilterCardProps {
  className?: string;
  beforeSearch(): void;
  onSuccess(offer: Offer): void;
  onError(e: Error): void;
}

const ErrorDisplay: React.FC<{ error: Error }> = ({ error }) => (
  <div className="error">{error.message}</div>
);
const DEMO_DATA: FlightCardProps["data"][] = [
  {
    id: "1",
    price: "$4,100",
    airlines: {
      logo: "https://www.gstatic.com/flights/airline_logos/70px/KE.png",
      name: "Korean Air",
    },
  },
  {
    id: "2",
    price: "$3,380",
    airlines: {
      logo: "https://www.gstatic.com/flights/airline_logos/70px/SQ.png",
      name: "Singapore Airlines",
    },
  },
  {
    id: "3",
    price: "$2,380",
    airlines: {
      logo: "https://www.gstatic.com/flights/airline_logos/70px/multi.png",
      name: "Philippine Airlines",
    },
  },
  {
    id: "1",
    price: "$4,100",
    airlines: {
      logo: "https://www.gstatic.com/flights/airline_logos/70px/KE.png",
      name: "Korean Air",
    },
  },
  {
    id: "2",
    price: "$3,380",
    airlines: {
      logo: "https://www.gstatic.com/flights/airline_logos/70px/SQ.png",
      name: "Singapore Airlines",
    },
  },
  {
    id: "1",
    price: "$4,100",
    airlines: {
      logo: "https://www.gstatic.com/flights/airline_logos/70px/KE.png",
      name: "Korean Air",
    },
  },
  {
    id: "2",
    price: "$3,380",
    airlines: {
      logo: "https://www.gstatic.com/flights/airline_logos/70px/SQ.png",
      name: "Singapore Airlines",
    },
  },
];

const SectionGridFilterCard: FC<SectionGridFilterCardProps> = ({
  className = "",
  beforeSearch,
  onSuccess,
  onError,
}) => {
  const [sort, setSort] = useState<'total_amount' | 'total_duration'>(
    'total_duration'
  );
  const [origin, setOrigin] = useState('JFK');
  const [destination, setDestination] = useState('LHR');
  const [isFetching, setIsFetching] = useState(false);
  const [offer, setOffer] = useState<Resource<Offer>>(null);
  const [order, setOrder] = useState<Resource<Order>>(null);
  const fetchOffers = async () => {
    beforeSearch();
    setIsFetching(true);

    try {
      const res = await fetch('/api/search', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          origin,
          destination,
          sort,
        }),
      });

      const { offer, errors } = await res.json();

      if (errors) {
        onError(
          new Error(
            Array.isArray(errors) ? errors[0].title : GENERIC_ERROR_MESSAGE
          )
        );
        return;
      }

      if (!offer) {
        onError(new Error(GENERIC_ERROR_MESSAGE));
        return;
      }

      onSuccess(offer);
    } catch (e) {
      onError(e instanceof Error ? e : new Error(GENERIC_ERROR_MESSAGE));
    }

    setIsFetching(false);
  };
 useEffect(()=>{
  fetchOffers()
 },[])
  const hasOffer =
    offer && typeof offer === 'object' && !(offer instanceof Error);
  const hasOrder =
    order && typeof order === 'object' && !(order instanceof Error);
  return (
    <div
      className={`nc-SectionGridFilterCard ${className}`}
      data-nc-id="SectionGridFilterCard"
    >
      <Heading2
        heading="Singapore - Tokyo"
        subHeading={
          <span className="block text-neutral-500 dark:text-neutral-400 mt-3">
            22 flights
            <span className="mx-2">·</span>
            round trip
            <span className="mx-2">·</span>2 Guests
          </span>
        }
      />
      <div className="mb-8 lg:mb-11">
        <TabFilters />
      </div>

      <div className="lg:p-10 lg:bg-neutral-50 lg:dark:bg-black/20 grid grid-cols-1 gap-6  rounded-3xl">
        {DEMO_DATA.map((item, index) => (
          <FlightCard defaultOpen={!index} key={index} data={item} />
        ))}

        <div className="flex mt-12 justify-center items-center">
          <ButtonPrimary loading>Show more</ButtonPrimary>
        </div>
      </div>
    </div>
  );
};

export default SectionGridFilterCard;
