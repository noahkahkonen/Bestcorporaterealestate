"use client";

import { useCallback, useEffect, useRef } from "react";
import { LoadScriptNext, GoogleMap, useGoogleMap } from "@react-google-maps/api";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { useMapStyles } from "@/lib/use-map-styles";
import type { Listing } from "@/types/listing";

const DEFAULT_CENTER = { lat: 39.9612, lng: -83.0007 };
/** Baseline zoom and floor for any programmatic fit — never auto zoom out beyond this; user can zoom out manually. */
const DEFAULT_ZOOM = 12;
const SINGLE_LISTING_ZOOM = 16;
const MAP_CONTAINER_STYLE = { width: "100%", height: "100%" };

function getMarkerIcon() {
  if (typeof google === "undefined" || !google.maps) return undefined;
  return {
    url: "/images/map-marker.svg",
    scaledSize: new google.maps.Size(56, 56),
    anchor: new google.maps.Point(28, 56),
  };
}

// Columbus/Central Ohio bounds - exclude markers with invalid or out-of-region coordinates
const VALID_LAT_MIN = 38.5;
const VALID_LAT_MAX = 41.5;
const VALID_LNG_MIN = -84.5;
const VALID_LNG_MAX = -81.5;

function isValidMapPosition(lat: number, lng: number): boolean {
  if (lat == null || lng == null || Number.isNaN(lat) || Number.isNaN(lng)) return false;
  if (lat === 0 && lng === 0) return false; // middle of ocean
  return lat >= VALID_LAT_MIN && lat <= VALID_LAT_MAX && lng >= VALID_LNG_MIN && lng <= VALID_LNG_MAX;
}

function MapMarkers({
  listings,
  onSelectListing,
}: {
  listings: Listing[];
  onSelectListing: (listing: Listing) => void;
}) {
  const map = useGoogleMap();
  const markersRef = useRef<google.maps.Marker[]>([]);
  const clustererRef = useRef<MarkerClusterer | null>(null);

  useEffect(() => {
    if (!map || !listings.length) return;
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
    clustererRef.current?.clearMarkers();
    clustererRef.current = null;

    const validListings = listings.filter((l) => isValidMapPosition(l.latitude, l.longitude));
    const bounds = new google.maps.LatLngBounds();
    const markers: google.maps.Marker[] = [];
    validListings.forEach((listing) => {
      const position = { lat: listing.latitude, lng: listing.longitude };
      bounds.extend(position);
      const marker = new google.maps.Marker({
        map,
        position,
        title: listing.title,
        icon: getMarkerIcon(),
      });
      marker.addListener("click", () => onSelectListing(listing));
      markers.push(marker);
    });
    markersRef.current = markers;

    if (markers.length > 1) {
      try {
        clustererRef.current = new MarkerClusterer({ map, markers });
      } catch {
        // ignore
      }
    }
    if (validListings.length === 1) {
      map.setCenter({ lat: validListings[0].latitude, lng: validListings[0].longitude });
      map.setZoom(SINGLE_LISTING_ZOOM);
    } else if (validListings.length > 1) {
      map.fitBounds(bounds, { top: 48, right: 48, bottom: 48, left: 48 });
      google.maps.event.addListenerOnce(map, "idle", () => {
        const z = map.getZoom();
        if (z != null && z < DEFAULT_ZOOM) map.setZoom(DEFAULT_ZOOM);
      });
    } else {
      map.setCenter(DEFAULT_CENTER);
      map.setZoom(DEFAULT_ZOOM);
    }
    return () => {
      markers.forEach((m) => m.setMap(null));
      clustererRef.current?.clearMarkers();
    };
  }, [map, listings, onSelectListing]);

  return null;
}

function MapWithMarkers({
  listings,
  onSelectListing,
}: {
  listings: Listing[];
  onSelectListing: (listing: Listing) => void;
}) {
  const handleSelect = useCallback(
    (listing: Listing) => onSelectListing(listing),
    [onSelectListing]
  );
  const styles = useMapStyles();

  return (
    <div className="relative h-full min-h-[400px] w-full">
      <GoogleMap
        mapContainerStyle={MAP_CONTAINER_STYLE}
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        options={{
          zoomControl: true,
          mapTypeControl: true,
          fullscreenControl: true,
          streetViewControl: false,
          styles: styles as google.maps.MapTypeStyle[],
        }}
      >
        <MapMarkers listings={listings} onSelectListing={handleSelect} />
      </GoogleMap>
    </div>
  );
}

export default function ListingsMap({
  listings,
  onSelectListing,
}: {
  listings: Listing[];
  /** Called when a map marker is clicked (parent handles UI, e.g. scroll sidebar). */
  onSelectListing: (listing: Listing) => void;
}) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey || apiKey === "your_google_maps_api_key_here") {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center bg-[var(--surface-muted)] text-[var(--charcoal-light)]">
        <p className="px-4 text-center text-sm">
          Map placeholder. Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to .env.local to show the map.
        </p>
      </div>
    );
  }

  return (
    <LoadScriptNext googleMapsApiKey={apiKey}>
      <MapWithMarkers listings={listings} onSelectListing={onSelectListing} />
    </LoadScriptNext>
  );
}
