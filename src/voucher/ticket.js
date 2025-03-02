import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Svg, { Path, Circle, Rect, Defs, LinearGradient, Stop } from "react-native-svg";

const { width } = Dimensions.get("window"); // Get screen width

const Ticket = () => {
  return (
    <View style={styles.container}>
      <Svg width={width * 0.95} height="180" viewBox="0 0 300 150">
        <Defs>
          {/* Gradient Definition */}
          <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#2B0F0F" />
            <Stop offset="100%" stopColor="#FEEAFD" />
          </LinearGradient>
        </Defs>

        {/* Ticket Shape with Gradient */}
        <Path
          d="M10,40 Q0,50 10,60 V90 Q0,100 10,110 H290 Q300,100 290,90 V60 Q300,50 290,40 H10 Z"
          fill="url(#grad)"
          stroke="#2B0F0F"
          strokeWidth="2"
        />

        {/* Ticket Text */}
        <Text style={styles.ticketTitle}>TICKET</Text>
        <Text style={styles.ticketSubtitle}>ADMIT ONE</Text>
        <Text style={styles.ticketNumber}>123456789</Text>

        {/* Perforation Dots */}
        {[...Array(6)].map((_, i) => (
          <Circle key={i} cx="150" cy={35 + i * 20} r="4" fill="white" />
        ))}

        {/* Star Box */}
        <Rect x="240" y="50" width="40" height="50" stroke="white" strokeWidth="2" fill="none" />

        {/* Stars */}
        {[...Array(5)].map((_, i) => (
          <Text key={i} style={[styles.star, { top: 55 + i * 10 }]}>★</Text>
        ))}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
 
  ticketTitle: {
    position: "absolute",
    top: 50,
    left: 50,
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  ticketSubtitle: {
    position: "absolute",
    top: 80,
    left: 50,
    fontSize: 16,
    color: "white",
  },
  ticketNumber: {
    position: "absolute",
    top: 105,
    left: 50,
    fontSize: 14,
    color: "white",
  },
  star: {
    position: "absolute",
    left: 260,
    fontSize: 12,
    color: "white",
  },
});

export default Ticket;
