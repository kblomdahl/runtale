import fs from 'node:fs';
import { XGBoost } from '@fractal-solutions/xgboost-js';

function parseValue(value) {
    if (value == "M") {
        return 1;
    } else if (value == "F") {
        return 0;
    } else {
        const parts  = value.split(":");

        if (parts.length == 3) {
            const hours = parseInt(parts[0], 10);
            const minutes = parseInt(parts[1], 10);
            const seconds = parseFloat(parts[2]);

            return hours * 3600 + minutes * 60 + seconds;
        } else if (parts.length == 2) {
            const minutes = parseInt(parts[0], 10);
            const seconds = parseFloat(parts[1]);

            return minutes * 60 + seconds;
        } else if (parts.length == 1) {
            return parseFloat(parts[0]);
        } else {
            throw new Error("Invalid time format");
        }
    }
}

function predictRegression(model, x) {
    let value = 0.0;

    for (const tree of model.trees) {
      value += model.learningRate * model._predict(x, tree.root);
    }

    return value;
}

const files = await fs.promises.readdir("data/race-predictor");
const lines = await Promise.all(files.map(async file => {
    const content = await fs.promises.readFile(`data/race-predictor/${file}`, { encoding: 'ascii'});
    const lines = content.split("\n").filter(line => line.trim() !== "");

    return lines;
}));
const predictions = lines.flatMap(lines => lines.map(line => line.split(",").map(value => parseValue(value.trim()))));
const X_train = predictions.flatMap(row => {
    return [
        [...row.slice(0, 4), 1609],
        [...row.slice(0, 4), 5000],
        [...row.slice(0, 4), 10000],
        [...row.slice(0, 4), 21097.5],
        [...row.slice(0, 4), 42195],
    ];
});
const y_train = predictions.flatMap(row => row.slice(4));
const model = new XGBoost({
    learningRate: 0.01,
    maxDepth: 5,
    minChildWeight: 1,
    numRounds: 500,
});

model.fit(X_train, y_train);
console.log(`Feature Importance`, model.getFeatureImportance());
console.log(`Prediction`, predictRegression(model, [240, 58, 38, 1, 5000]));

await fs.promises.writeFile(
    `public/models/race-predictor.json`,
    JSON.stringify(model.toJSON())
);
