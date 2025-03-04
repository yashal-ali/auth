"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connection = {};
function dbConnect() {
    return __awaiter(this, void 0, void 0, function* () {
        // Check if we have a connection to the database or if it's currently connecting
        if (connection.isConnected) {
            // console.log('Already connected to the database');
            return;
        }
        try {
            // Attempt to connect to the database
            const db = yield mongoose_1.default.connect(process.env.MONGODB_URI || '', {});
            connection.isConnected = db.connections[0].readyState;
            console.log('Database connected successfully');
        }
        catch (error) {
            // console.error('Database connection failed:', error);
            // Graceful exit in case of a connection error
            process.exit(1);
        }
    });
}
exports.default = dbConnect;
