// DateInput.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import { BoldText } from "./texts";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function daysInMonth(y, m) {
  return new Date(y || 2000, m, 0).getDate(); // y fallback avoids NaN
}

export default function DateInput({
  value,                    // "YYYY-MM-DD" | undefined
  onChange,                 // (dateStr | null) => void
  onValidChange,            // (isValid:boolean) => void
  style, inputStyle, errorTextStyle, separatorStyle
}) {
  const [yyyy, setYYYY] = useState("");
  const [mm, setMM] = useState("");
  const [dd, setDD] = useState("");
  const yRef = useRef(null);
  const mRef = useRef(null);
  const dRef = useRef(null);

  // hydrate from value
  useEffect(() => {
    if (!value) return;
    const m = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m) {
      setYYYY(m[1]); setMM(m[2]); setDD(m[3]);
    }
  }, [value]);

  // build output + validity
  const { dateStr, isValid, err } = useMemo(() => {
    if (yyyy.length < 4 || mm.length < 2 || dd.length < 2) {
      return { dateStr: null, isValid: false, err: null };
    }
    const Y = parseInt(yyyy, 10);
    const M = clamp(parseInt(mm, 10), 1, 12);
    const maxD = daysInMonth(Y, M);
    const Draw = parseInt(dd, 10);
    const D = clamp(Draw, 1, maxD);

    const valid =
      Y >= 1000 && Y <= 9999 &&
      Draw >= 1 && Draw <= maxD &&
      parseInt(mm, 10) === M;

    const out = `${String(Y).padStart(4, "0")}-${String(M).padStart(2, "0")}-${String(D).padStart(2, "0")}`;
    return { dateStr: valid ? out : null, isValid: valid, err: valid ? null : "Invalid date" };
  }, [yyyy, mm, dd]);

  useEffect(() => {
    onChange?.(dateStr);
    onValidChange?.(!!dateStr);
  }, [dateStr, onChange, onValidChange]);

  const handleYear = (t) => {
    const v = t.replace(/\D/g, "").slice(0, 4);
    setYYYY(v);
    if (v.length === 4) mRef.current?.focus();
  };

  const handleMonth = (t) => {
    let v = t.replace(/\D/g, "").slice(0, 2);
    // auto leading 0 if user types 2x fast like "9" -> "09"? keep natural:
    if (v.length === 1 && parseInt(v, 10) > 1) v = "0" + v; // 2..9 becomes 02..09
    setMM(v);
    if (v.length === 2) dRef.current?.focus();
  };

  const handleDay = (t) => {
    let v = t.replace(/\D/g, "").slice(0, 2);
    if (v.length === 1 && parseInt(v, 10) > 3) v = "0" + v; // 4..9 -> 04..09
    setDD(v);
  };

  const onBackspaceMM = (e) => {
    if (mm.length === 0 && e.nativeEvent.key === "Backspace") yRef.current?.focus();
  };
  const onBackspaceDD = (e) => {
    if (dd.length === 0 && e.nativeEvent.key === "Backspace") mRef.current?.focus();
  };

  return (
    <View style={[styles.row, style, { justifyContent: "space-between" }]}>
      <View>
        <BoldText text="YYYY" color="#000" />
        <TextInput
          ref={yRef}
          value={yyyy}
          onChangeText={handleYear}
          keyboardType="number-pad"
          maxLength={4}
          placeholder="YYYY"
          style={[styles.input, inputStyle]}
          returnKeyType="next"
        />
      </View>
      <Text style={[styles.sep, separatorStyle]}>-</Text>
      <View>
        <BoldText text="MM" color="#000" />
        <TextInput
          ref={mRef}
          value={mm}
          onChangeText={handleMonth}
          keyboardType="number-pad"
          maxLength={2}
          placeholder="MM"
          style={[styles.input, inputStyle]}
          onKeyPress={onBackspaceMM}
          returnKeyType="next"
        />
      </View>
      <Text style={[styles.sep, separatorStyle]}>-</Text>

      <View>
        <BoldText text="DD" color="#000" />
        <TextInput
          ref={dRef}
          value={dd}
          onChangeText={handleDay}
          keyboardType="number-pad"
          maxLength={2}
          placeholder="DD"
          style={[styles.input, inputStyle]}
          onKeyPress={onBackspaceDD}
          returnKeyType="done"
        />
      </View>
      {!isValid && (yyyy + mm + dd).length >= 8 ? (
        <Text style={[styles.error, errorTextStyle]}>{err}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    minWidth: 90,
    textAlign: "center",
    fontSize: 16,
  },
  sep: { marginHorizontal: 6, fontSize: 18 },
  error: { marginLeft: 10, color: "crimson", fontSize: 12 }
});
