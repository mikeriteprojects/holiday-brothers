"use client";

import { useEffect, useRef, useState } from "react";
import { isInServiceArea } from "@/lib/booking/rockland";

interface NominatimAddress {
  house_number?: string;
  road?: string;
  city?: string;
  town?: string;
  village?: string;
  hamlet?: string;
  state?: string;
  postcode?: string;
  county?: string;
}

interface NominatimResult {
  display_name: string;
  address: NominatimAddress;
}

export interface AddressFields {
  street: string;
  city: string;
  state: string;
  zip: string;
}

const EMPTY_FIELDS: AddressFields = { street: "", city: "", state: "", zip: "" };

interface Props {
  initialValue?: AddressFields;
  onChange: (assembledAddress: string, fields: AddressFields) => void;
  onTypingChange?: (typedText: string) => void;
  onValidityChange?: (inServiceArea: boolean | null) => void;
}

export default function AddressLookup({ initialValue, onChange, onTypingChange, onValidityChange }: Props) {
  const [street, setStreet] = useState(initialValue?.street ?? EMPTY_FIELDS.street);
  const [city, setCity] = useState(initialValue?.city ?? EMPTY_FIELDS.city);
  const [state, setState] = useState(initialValue?.state ?? EMPTY_FIELDS.state);
  const [zip, setZip] = useState(initialValue?.zip ?? EMPTY_FIELDS.zip);
  const [county, setCounty] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const inServiceArea = isInServiceArea(county, zip);

  useEffect(() => {
    const assembled = [street, city && state ? `${city}, ${state}` : city || state, zip]
      .filter(Boolean)
      .join(", ");
    onChange(assembled, { street, city, state, zip });
    onTypingChange?.(assembled);
    onValidityChange?.(inServiceArea);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [street, city, state, zip, county]);

  function cancelPendingLookup() {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    abortRef.current?.abort();
  }

  function handleStreetChange(v: string) {
    setStreet(v);
    setCounty(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (v.trim().length < 4) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = setTimeout(() => runLookup(v), 500);
  }

  async function runLookup(query: string) {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    try {
      const url =
        "https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&countrycodes=us&limit=5&q=" +
        encodeURIComponent(query);
      const res = await fetch(url, { signal: controller.signal });
      const data: NominatimResult[] = await res.json();
      setSuggestions(data);
      setShowSuggestions(true);
    } catch {
      // network hiccup or aborted — leave existing suggestions alone
    } finally {
      setLoading(false);
    }
  }

  function pickSuggestion(r: NominatimResult) {
    cancelPendingLookup();
    const a = r.address;
    const streetLine = [a.house_number, a.road].filter(Boolean).join(" ");
    setStreet(streetLine || street);
    setCity(a.city || a.town || a.village || a.hamlet || "");
    setState(a.state || "");
    setZip(a.postcode || "");
    setCounty(a.county || null);
    setSuggestions([]);
    setShowSuggestions(false);
  }

  return (
    <div>
      <div className="relative">
        <input
          className="input"
          placeholder="Street address"
          value={street}
          onChange={(e) => handleStreetChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          onBlur={() => window.setTimeout(() => setShowSuggestions(false), 150)}
          autoComplete="off"
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul
            className="glass absolute left-0 right-0 top-full z-20 mt-1 max-h-56 overflow-auto p-1"
            style={{ backgroundColor: "var(--bg-deep-2)" }}
          >
            {suggestions.map((r, i) => (
              <li key={i}>
                <button
                  type="button"
                  className="w-full rounded-sm px-3 py-2 text-left text-[13.5px] hover:bg-white/5"
                  style={{ color: "var(--text-cream)" }}
                  onMouseDown={() => pickSuggestion(r)}
                >
                  {r.display_name}
                </button>
              </li>
            ))}
          </ul>
        )}
        {loading && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px]" style={{ color: "var(--text-faint)" }}>
            searching…
          </span>
        )}
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
        <input
          className="input"
          placeholder="City"
          value={city}
          onChange={(e) => {
            setCounty(null);
            setCity(e.target.value);
          }}
        />
        <input
          className="input"
          placeholder="State"
          value={state}
          onChange={(e) => {
            setCounty(null);
            setState(e.target.value);
          }}
        />
        <input
          className="input"
          placeholder="Zip"
          value={zip}
          onChange={(e) => {
            setCounty(null);
            setZip(e.target.value);
          }}
        />
      </div>

      {inServiceArea === false && (
        <p className="mt-2 text-[13.5px]" style={{ color: "var(--danger)" }}>
          This address looks outside Rockland County — we may not be able to service it this season.
        </p>
      )}
    </div>
  );
}
