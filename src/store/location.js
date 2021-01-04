import { observable } from "mobx";
const locationStore = observable({
  lat: 30.229271,
  lnt: 120.255384,
  setLocation(latitude, longitude) {
    console.log(latitude, longitude)
    this.lat = latitude;
    this.lnt = longitude;
  },
});
export default locationStore;
