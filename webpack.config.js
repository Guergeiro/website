const webpack = require("webpack");
const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

module.exports = envVars => {
  let conf = getConf(envVars);

  console.log(`\nRunning "${conf.environment}" configs.\n`);

  let bundleVersion = "";
  if (conf.environment == "production") {
    bundleVersion = ".min";
  }

  return {
    entry: path.resolve(__dirname, "public/assets/js/_bundle.js"),
    mode: conf.environment,
    output: {
      path: path.resolve(__dirname, "public/assets/js/"),
      filename: `bundle${bundleVersion}.js`
    },
    module: {
      rules: [
        {
          test: /\.pug$/,
          loader: "pug-plain-loader"
        },
        {
          test: /\.vue$/,
          loader: "vue-loader"
        },
        // this will apply to both plain `.js` files
        // AND `<script>` blocks in `.vue` files
        {
          test: /\.js$/,
          loader: "babel-loader"
        },
        // this will apply to both plain `.css` files
        // AND `<style>` blocks in `.vue` files
        {
          test: /\.scss$/,
          use: [
            "style-loader", // creates style nodes from JS strings
            "css-loader", // translates CSS into CommonJS
            "sass-loader" // compiles Sass to CSS, using Node Sass by default
          ]
        }
      ]
    },
    plugins: [
      // make sure to include the plugin!
      new VueLoaderPlugin(),
      // Add compile time vars
      new webpack.DefinePlugin({
        "process.env": {
          conf: JSON.stringify(conf)
        }
      })
    ],
    resolve: {
      alias: {
        vue:
          conf.environment == "production"
            ? "vue/dist/vue.min.js"
            : "vue/dist/vue.js",
        "/src": path.resolve(__dirname, "src"),
        "/components": path.resolve(__dirname, "src/vue/components"),
        "/public": path.resolve(__dirname, "public")
      }
    }
  };
};

function getBaseUrl(envVars) {
  if (envVars.environment !=  "production") {
    return envVars.base_url
      ? envVars.base_url
      : "";
  }

  return "/deno-drash-docs";
}

function getConf(envVars) {
  return {
    base_url: getBaseUrl(envVars),
    build_date: envVars.build_date,
    deno_version: getDenoVersion(envVars.deno_version), // Used in sidebar.vue
    environment: envVars.environment,
    drash_latest_release: envVars.drash_latest_release,
    module_name: "Drash", // Used in HTML <title> element
  };
}

function getDenoVersion(version) {
  return version
    .replace("deno: ", "Deno v")
    .replace("\nv8: ", ", V8 v")
    .replace("\ntypescript: ", ", and TypeScript v");
}
