export default {
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
      const closestFitnessCenter = localStorage.getItem(
        "closest-fitness-center"
      );
      if (closestFitnessCenter) {
        this._location = JSON.parse(closestFitnessCenter);
        return;
      }

      const API_KEY = import.meta.env.VITE_GEO_API_KEY;
      const url = `https://api.ipgeolocation.io/ipgeo?apiKey=${API_KEY}`;
      try {
        const rec = await fetch(url);
        const data = await rec.json();
        const _location = {
          city: data.city,
          country: data.country_name,
          state: data.state_prov,
          lat: data.latitude,
          long: data.longitude,
          state: data.state_prov,
          zip: data.zipcode,
        };

        this._location = _location;
        await this.$store.setLocale(data.state_code);
        localStorage.setItem(
          "closest-fitness-center",
          JSON.stringify(_location)
        );
      } catch (error) {
        console.log("error getting geo", error);
      }
    },
  },
};
