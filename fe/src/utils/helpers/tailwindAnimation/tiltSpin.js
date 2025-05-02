export function tiltSpin({ matchUtilities, addBase }) {
  const animations = {};
  matchUtilities(
    {
      tilt: (value) => {
        // tilt-[x_y_z] => tilt div with x y z rotation in degrees
        // x = x-axis rotation in degrees
        // y = y-axis rotation in degrees
        // z = z-axis rotation in degrees
        const parts = value.split(" ").map((part) => part.trim());
        if (parts.length > 3) return {};
        for (let i = 0; i < parts.length; i++) {
          if (!(parts[i] <= 0) && !(parts[i] > 0)) return {}; // custom isNan check
        }
        const [xDeg = 0, yDeg = 0, zDeg = 0] = parts;
        return {
          transform: `rotateX(${xDeg}deg) rotateY(${yDeg}deg) rotateZ(${zDeg}deg)`,
          "backface-visibility": "visible",
          "transform-style": "preserve-3d",
        };
      },
      "tilt-spin": (value) => {
        // tilt-spin-[x_y_t_r] => spin div with tilt and spin animation
        // x = x-axis rotation in degrees
        // y = y-axis rotation in degrees
        // t = duration in miliseconds
        // r = 0 = clockwise, 1 = counterclockwise
        const parts = value.split(" ").map((part) => part.trim());
        if (parts.length > 4) return {};
        for (let i = 0; i < parts.length; i++) {
          if (!(parts[i] <= 0) && !(parts[i] > 0)) return {}; // custom isNan check
        }
        const [xDeg = 0, yDeg = 0, duration = 0, reverse = 0] = parts;

        if (duration === 0 || !duration) {
          // kasus tilt-spin-[x_y?]
          return {
            transform: `rotateX(${xDeg}deg) rotateY(${yDeg}deg)`,
            "backface-visibility": "visible",
            "transform-style": "preserve-3d",
          };
        }

        const zDeg = Number(reverse) === 1 ? -360 : 360;
        const animationName = `spin-tilt-${xDeg}-${yDeg}-${zDeg}-${duration}-${reverse}`;
        animations[`@keyframes ${animationName}`] = {
          "0%": { transform: `rotateX(${xDeg}deg) rotateY(${yDeg}deg) rotateZ(0deg);` },
          "100%": { transform: `rotateX(${xDeg}deg) rotateY(${yDeg}deg) rotateZ(${zDeg}deg);` },
        };

        addBase(animations);
        return {
          animation: `${animationName} ${duration}ms linear infinite`,
          "transform-style": "preserve-3d",
          "backface-visibility": "visible",
        };
      },
    },
    { values: {} },
  );
}
