export const locationMixin = {
  data() {
    return {
      _location: {
        city: "",
        country: "",
        state: "",
        lat: "",
        long: "",
        zip: "",
      },
    };
  },
  methods: {
    async _getGeo() {
      const API_KEY = import.meta.env.VITE_GEO_API_KEY;
      const url = `https://api.ipgeolocation.io/ipgeo?apiKey=${API_KEY}`;
      try {
        const rec = await fetch(url);
        const data = await rec.json();
        this._location = {
          city: data.city,
          country: data.country_name,
          state: data.state_prov,
          lat: data.latitude,
          long: data.longitude,
          state: data.state_prov,
          zip: data.zipcode,
        };
      } catch (error) {
        console.log("error getting geo", error);
      }
    },
  },
};
