export const renderMapBox = async (location, lng, lat) => {
    const accessToken =
        'pk.eyJ1IjoidmVsaXNsYXYiLCJhIjoiY2xwOXd0eWZvMDF0NjJrcXJpaDlteWg5YSJ9.JSXz3etRl9DVlCGozZvXHg';

    navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
        enableHighAccuracy: true,
    });

    function successLocation(pos) {
        const currentLocation = [pos.coords.longitude, pos.coords.latitude];
        const locations = [
            {
                name: location,
                coordinates: [lng, lat],
            },
            {
                name: 'Cuurent Location',
                coordinates: currentLocation,
            },
        ];

        mapSetup(locations);
    }
    function errorLocation() {
        const currentLocation = [23.326347032388227, 42.69641194208828];
        const locations = [
            {
                name: 'Krushana Waterfalls',
                coordinates: [25.03367351984267, 43.24330961085162],
            },
            {
                name: 'Cuurent Location',
                coordinates: currentLocation,
            },
        ];
        mapSetup(locations);
    }

    function mapSetup(locations) {
        mapboxgl.accessToken = accessToken;

        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/velislav/cld4ortkj000201lhhk5bspkj',
            scrollZoom: true,
            zoom: 6,
        });

        const bounds = new mapboxgl.LngLatBounds();

        locations.forEach((location) => {
            const element = document.createElement('div');
            element.className = 'marker';

            new mapboxgl.Marker({
                element: element,
                anchor: 'bottom',
            })
                .setLngLat(location.coordinates)
                .addTo(map);

            new mapboxgl.Popup({
                offset: 30,
            })
                .setLngLat(location.coordinates)
                .setHTML(`<p>${location.name}</p>`)
                .addTo(map);

            bounds.extend(location.coordinates);
        });

        map.fitBounds(bounds);
        const getRoute = async function () {
            const repsone = await fetch(
                `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${locations[0].coordinates};${locations[1].coordinates}?access_token=${accessToken}`
            );
            const data = await repsone.json();

            const distance = ((data.trips[0].distance / 1000).toFixed(2) / 2)
                .toString()
                .split('.')[0];
            const duration = secondsToHoursMinutes(data.trips[0].duration / 2);

            document.querySelector('.distance').textContent = `${distance} km`;
            document.querySelector('.duration').textContent = duration;

            const route = data.trips[0].geometry;
            const decodedCords = decodedGeometry(route);

            const routeGeoJSON = {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'LineString',
                    coordinates: decodedCords,
                },
            };
            map.on('load', function () {
                map.addLayer({
                    id: 'route',
                    type: 'line',
                    source: {
                        type: 'geojson',
                        data: routeGeoJSON,
                    },
                    layout: {
                        'line-join': 'round',
                        'line-cap': 'round',
                    },
                    paint: {
                        'line-color': '#55c57a',
                        'line-width': 5,
                    },
                });
            });
        };
        getRoute();
    }

    function decodedGeometry(str) {
        var index = 0,
            lat = 0,
            lng = 0,
            coordinates = [];
        var shift = 0,
            result = 0,
            byte = null;

        while (index < str.length) {
            byte = null;
            shift = 0;
            result = 0;
            do {
                byte = str.charCodeAt(index++) - 63;
                result |= (byte & 0x1f) << shift;
                shift += 5;
            } while (byte >= 0x20);

            var dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
            lat += dlat;

            shift = 0;
            result = 0;
            byte = null;
            do {
                byte = str.charCodeAt(index++) - 63;
                result |= (byte & 0x1f) << shift;
                shift += 5;
            } while (byte >= 0x20);

            var dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
            lng += dlng;

            coordinates.push([lng * 1e-5, lat * 1e-5]);
        }

        return coordinates;
    }

    function secondsToHoursMinutes(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        return `${hours} hours ${minutes} minutes`;
    }
};
