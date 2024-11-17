import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
const Room = () => {
  let [searchParams, setSearchParams] = useSearchParams();
  let name = searchParams.get("name");
  useEffect(() => {}, [name]);

  return (
    <>
      <div> Hi {name}</div>
    </>
  );
};

export default Room;
