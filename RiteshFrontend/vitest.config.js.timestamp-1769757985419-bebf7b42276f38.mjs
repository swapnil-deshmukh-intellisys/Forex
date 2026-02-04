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
      "coverage"
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZXN0LmNvbmZpZy5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXEFkbWluXFxcXERlc2t0b3BcXFxcSW50ZWxsaXN5c1xcXFxGb3JleFxcXFxSaXRlc2hGcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcQWRtaW5cXFxcRGVza3RvcFxcXFxJbnRlbGxpc3lzXFxcXEZvcmV4XFxcXFJpdGVzaEZyb250ZW5kXFxcXHZpdGVzdC5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL0FkbWluL0Rlc2t0b3AvSW50ZWxsaXN5cy9Gb3JleC9SaXRlc2hGcm9udGVuZC92aXRlc3QuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZXN0L2NvbmZpZyc7XHJcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XHJcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbcmVhY3QoKV0sXHJcbiAgdGVzdDoge1xyXG4gICAgZ2xvYmFsczogdHJ1ZSxcclxuICAgIGVudmlyb25tZW50OiAnanNkb20nLFxyXG4gICAgc2V0dXBGaWxlczogWycuL3NyYy90ZXN0L3NldHVwLmpzJ10sXHJcbiAgICBjc3M6IHRydWUsXHJcbiAgICB0ZXN0VGltZW91dDogMTAwMDAsXHJcbiAgICBob29rVGltZW91dDogMTAwMDAsXHJcbiAgICBpbmNsdWRlOiBbJ3NyYy8qKi8qLnt0ZXN0LHNwZWN9Lntqcyxqc3gsdHMsdHN4fSddLFxyXG4gICAgZXhjbHVkZTogW1xyXG4gICAgICAnbm9kZV9tb2R1bGVzJyxcclxuICAgICAgJ2Rpc3QnLFxyXG4gICAgICAnLmlkZWEnLFxyXG4gICAgICAnLmdpdCcsXHJcbiAgICAgICcuY2FjaGUnLFxyXG4gICAgICAnY292ZXJhZ2UnLFxyXG4gICAgXSxcclxuICAgIGNvdmVyYWdlOiB7XHJcbiAgICAgIHByb3ZpZGVyOiAndjgnLFxyXG4gICAgICByZXBvcnRlcjogWyd0ZXh0JywgJ2pzb24nLCAnaHRtbCcsICdsY292J10sXHJcbiAgICAgIGV4Y2x1ZGU6IFtcclxuICAgICAgICAnbm9kZV9tb2R1bGVzLycsXHJcbiAgICAgICAgJ3NyYy90ZXN0LycsXHJcbiAgICAgICAgJyoqLyouY29uZmlnLmpzJyxcclxuICAgICAgICAnKiovKi5jb25maWcudHMnLFxyXG4gICAgICAgICcqKi9kaXN0LycsXHJcbiAgICAgICAgJyoqL2J1aWxkLycsXHJcbiAgICAgICAgJyoqL2NvdmVyYWdlLycsXHJcbiAgICAgICAgJyoqLyouZC50cycsXHJcbiAgICAgICAgJyoqL21haW4uanN4JyxcclxuICAgICAgICAnKiovaW5kZXguanMnLFxyXG4gICAgICBdLFxyXG4gICAgICB0aHJlc2hvbGRzOiB7XHJcbiAgICAgICAgbGluZXM6IDcwLFxyXG4gICAgICAgIGZ1bmN0aW9uczogNzAsXHJcbiAgICAgICAgYnJhbmNoZXM6IDYwLFxyXG4gICAgICAgIHN0YXRlbWVudHM6IDcwLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHBvb2w6ICd0aHJlYWRzJyxcclxuICAgIHBvb2xPcHRpb25zOiB7XHJcbiAgICAgIHRocmVhZHM6IHtcclxuICAgICAgICBzaW5nbGVUaHJlYWQ6IGZhbHNlLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIG1heENvbmN1cnJlbmN5OiA1LFxyXG4gICAgbWluVGhyZWFkczogMSxcclxuICAgIG1heFRocmVhZHM6IDQsXHJcbiAgfSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpLFxyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBc1csU0FBUyxvQkFBb0I7QUFDblksT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUZqQixJQUFNLG1DQUFtQztBQUl6QyxJQUFPLHdCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsTUFBTTtBQUFBLElBQ0osU0FBUztBQUFBLElBQ1QsYUFBYTtBQUFBLElBQ2IsWUFBWSxDQUFDLHFCQUFxQjtBQUFBLElBQ2xDLEtBQUs7QUFBQSxJQUNMLGFBQWE7QUFBQSxJQUNiLGFBQWE7QUFBQSxJQUNiLFNBQVMsQ0FBQyxzQ0FBc0M7QUFBQSxJQUNoRCxTQUFTO0FBQUEsTUFDUDtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsSUFDRjtBQUFBLElBQ0EsVUFBVTtBQUFBLE1BQ1IsVUFBVTtBQUFBLE1BQ1YsVUFBVSxDQUFDLFFBQVEsUUFBUSxRQUFRLE1BQU07QUFBQSxNQUN6QyxTQUFTO0FBQUEsUUFDUDtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxNQUNBLFlBQVk7QUFBQSxRQUNWLE9BQU87QUFBQSxRQUNQLFdBQVc7QUFBQSxRQUNYLFVBQVU7QUFBQSxRQUNWLFlBQVk7QUFBQSxNQUNkO0FBQUEsSUFDRjtBQUFBLElBQ0EsTUFBTTtBQUFBLElBQ04sYUFBYTtBQUFBLE1BQ1gsU0FBUztBQUFBLFFBQ1AsY0FBYztBQUFBLE1BQ2hCO0FBQUEsSUFDRjtBQUFBLElBQ0EsZ0JBQWdCO0FBQUEsSUFDaEIsWUFBWTtBQUFBLElBQ1osWUFBWTtBQUFBLEVBQ2Q7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN0QztBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
