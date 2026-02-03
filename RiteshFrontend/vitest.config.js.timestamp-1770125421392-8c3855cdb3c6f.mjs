// vitest.config.js
import { defineConfig } from "file:///C:/Users/Admin/Desktop/Intellisys/Forex/RiteshFrontend/node_modules/vitest/dist/config.js";
import react from "file:///C:/Users/Admin/Desktop/Intellisys/Forex/RiteshFrontend/node_modules/@vitejs/plugin-react/dist/index.js";
import path from "path";
var __vite_injected_original_dirname = "C:\\Users\\Admin\\Desktop\\Intellisys\\Forex\\RiteshFrontend";
var vitest_config_default = defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.js"],
    css: true,
    testTimeout: 1e4,
    hookTimeout: 1e4,
    include: ["src/**/*.{test,spec}.{js,jsx,ts,tsx}"],
    exclude: [
      "node_modules",
      "dist",
      ".idea",
      ".git",
      ".cache",
      "coverage",
      "src/tests/f2p/integration.f2p.test.jsx",
      "src/tests/f2p/trading.f2p.test.jsx"
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      exclude: [
        "node_modules/",
        "src/test/",
        "**/*.config.js",
        "**/*.config.ts",
        "**/dist/",
        "**/build/",
        "**/coverage/",
        "**/*.d.ts",
        "**/main.jsx",
        "**/index.js"
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 60,
        statements: 70
      }
    },
    pool: "threads",
    poolOptions: {
      threads: {
        singleThread: false
      }
    },
    maxConcurrency: 5,
    minThreads: 1,
    maxThreads: 4
  },
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  }
});
export {
  vitest_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZXN0LmNvbmZpZy5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXEFkbWluXFxcXERlc2t0b3BcXFxcSW50ZWxsaXN5c1xcXFxGb3JleFxcXFxSaXRlc2hGcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcQWRtaW5cXFxcRGVza3RvcFxcXFxJbnRlbGxpc3lzXFxcXEZvcmV4XFxcXFJpdGVzaEZyb250ZW5kXFxcXHZpdGVzdC5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL0FkbWluL0Rlc2t0b3AvSW50ZWxsaXN5cy9Gb3JleC9SaXRlc2hGcm9udGVuZC92aXRlc3QuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZXN0L2NvbmZpZyc7XHJcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XHJcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbcmVhY3QoKV0sXHJcbiAgdGVzdDoge1xyXG4gICAgZ2xvYmFsczogdHJ1ZSxcclxuICAgIGVudmlyb25tZW50OiAnanNkb20nLFxyXG4gICAgc2V0dXBGaWxlczogWycuL3NyYy90ZXN0L3NldHVwLmpzJ10sXHJcbiAgICBjc3M6IHRydWUsXHJcbiAgICB0ZXN0VGltZW91dDogMTAwMDAsXHJcbiAgICBob29rVGltZW91dDogMTAwMDAsXHJcbiAgICBpbmNsdWRlOiBbJ3NyYy8qKi8qLnt0ZXN0LHNwZWN9Lntqcyxqc3gsdHMsdHN4fSddLFxyXG4gICAgZXhjbHVkZTogW1xyXG4gICAgICAnbm9kZV9tb2R1bGVzJyxcclxuICAgICAgJ2Rpc3QnLFxyXG4gICAgICAnLmlkZWEnLFxyXG4gICAgICAnLmdpdCcsXHJcbiAgICAgICcuY2FjaGUnLFxyXG4gICAgICAnY292ZXJhZ2UnLFxyXG4gICAgICAnc3JjL3Rlc3RzL2YycC9pbnRlZ3JhdGlvbi5mMnAudGVzdC5qc3gnLFxyXG4gICAgICAnc3JjL3Rlc3RzL2YycC90cmFkaW5nLmYycC50ZXN0LmpzeCcsXHJcbiAgICBdLFxyXG4gICAgY292ZXJhZ2U6IHtcclxuICAgICAgcHJvdmlkZXI6ICd2OCcsXHJcbiAgICAgIHJlcG9ydGVyOiBbJ3RleHQnLCAnanNvbicsICdodG1sJywgJ2xjb3YnXSxcclxuICAgICAgZXhjbHVkZTogW1xyXG4gICAgICAgICdub2RlX21vZHVsZXMvJyxcclxuICAgICAgICAnc3JjL3Rlc3QvJyxcclxuICAgICAgICAnKiovKi5jb25maWcuanMnLFxyXG4gICAgICAgICcqKi8qLmNvbmZpZy50cycsXHJcbiAgICAgICAgJyoqL2Rpc3QvJyxcclxuICAgICAgICAnKiovYnVpbGQvJyxcclxuICAgICAgICAnKiovY292ZXJhZ2UvJyxcclxuICAgICAgICAnKiovKi5kLnRzJyxcclxuICAgICAgICAnKiovbWFpbi5qc3gnLFxyXG4gICAgICAgICcqKi9pbmRleC5qcycsXHJcbiAgICAgIF0sXHJcbiAgICAgIHRocmVzaG9sZHM6IHtcclxuICAgICAgICBsaW5lczogNzAsXHJcbiAgICAgICAgZnVuY3Rpb25zOiA3MCxcclxuICAgICAgICBicmFuY2hlczogNjAsXHJcbiAgICAgICAgc3RhdGVtZW50czogNzAsXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgcG9vbDogJ3RocmVhZHMnLFxyXG4gICAgcG9vbE9wdGlvbnM6IHtcclxuICAgICAgdGhyZWFkczoge1xyXG4gICAgICAgIHNpbmdsZVRocmVhZDogZmFsc2UsXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgbWF4Q29uY3VycmVuY3k6IDUsXHJcbiAgICBtaW5UaHJlYWRzOiAxLFxyXG4gICAgbWF4VGhyZWFkczogNCxcclxuICB9LFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyksXHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG5cclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFzVyxTQUFTLG9CQUFvQjtBQUNuWSxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBRmpCLElBQU0sbUNBQW1DO0FBSXpDLElBQU8sd0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxFQUNqQixNQUFNO0FBQUEsSUFDSixTQUFTO0FBQUEsSUFDVCxhQUFhO0FBQUEsSUFDYixZQUFZLENBQUMscUJBQXFCO0FBQUEsSUFDbEMsS0FBSztBQUFBLElBQ0wsYUFBYTtBQUFBLElBQ2IsYUFBYTtBQUFBLElBQ2IsU0FBUyxDQUFDLHNDQUFzQztBQUFBLElBQ2hELFNBQVM7QUFBQSxNQUNQO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLElBQ0Y7QUFBQSxJQUNBLFVBQVU7QUFBQSxNQUNSLFVBQVU7QUFBQSxNQUNWLFVBQVUsQ0FBQyxRQUFRLFFBQVEsUUFBUSxNQUFNO0FBQUEsTUFDekMsU0FBUztBQUFBLFFBQ1A7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsTUFDQSxZQUFZO0FBQUEsUUFDVixPQUFPO0FBQUEsUUFDUCxXQUFXO0FBQUEsUUFDWCxVQUFVO0FBQUEsUUFDVixZQUFZO0FBQUEsTUFDZDtBQUFBLElBQ0Y7QUFBQSxJQUNBLE1BQU07QUFBQSxJQUNOLGFBQWE7QUFBQSxNQUNYLFNBQVM7QUFBQSxRQUNQLGNBQWM7QUFBQSxNQUNoQjtBQUFBLElBQ0Y7QUFBQSxJQUNBLGdCQUFnQjtBQUFBLElBQ2hCLFlBQVk7QUFBQSxJQUNaLFlBQVk7QUFBQSxFQUNkO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
