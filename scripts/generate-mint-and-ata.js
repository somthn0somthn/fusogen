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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var anchor = require("@coral-xyz/anchor");
var web3_js_1 = require("@solana/web3.js");
var spl_token_1 = require("@solana/spl-token");
function generateMintAndATA() {
    return __awaiter(this, void 0, void 0, function () {
        var connection, user, airdropSignature, mintAuthority, freezeAuthority, mint, userATA, amount;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    connection = new web3_js_1.Connection("http://127.0.0.1:8899", 'confirmed');
                    user = web3_js_1.Keypair.generate();
                    return [4 /*yield*/, connection.requestAirdrop(user.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL)];
                case 1:
                    airdropSignature = _a.sent();
                    return [4 /*yield*/, connection.confirmTransaction(airdropSignature)];
                case 2:
                    _a.sent();
                    mintAuthority = web3_js_1.Keypair.generate();
                    freezeAuthority = null;
                    return [4 /*yield*/, (0, spl_token_1.createMint)(connection, // Connection to Solana network
                        user, // The account paying for the creation of the mint
                        mintAuthority.publicKey, // Mint authority (who can mint new tokens)
                        freezeAuthority, // Freeze authority (optional, can be null)
                        9)];
                case 3:
                    mint = _a.sent();
                    console.log("Mint Address: ".concat(mint.toBase58()));
                    return [4 /*yield*/, (0, spl_token_1.getOrCreateAssociatedTokenAccount)(connection, // Connection
                        user, // Payer (who pays for the creation of the ATA)
                        mint, // The mint for which the ATA is being created
                        user.publicKey // Owner of the ATA (the user's wallet)
                        )];
                case 4:
                    userATA = _a.sent();
                    console.log("User ATA Address: ".concat(userATA.address.toBase58()));
                    amount = 1000;
                    return [4 /*yield*/, (0, spl_token_1.mintTo)(connection, // Connection
                        user, // Payer
                        mint, // Mint account
                        userATA.address, // Destination ATA (where tokens go)
                        mintAuthority, // Mint authority (who has the right to mint)
                        amount // Amount to mint (1000 tokens)
                        )];
                case 5:
                    _a.sent();
                    console.log("Minted ".concat(amount / Math.pow(10, 9), " tokens to ATA: ").concat(userATA.address.toBase58()));
                    return [2 /*return*/];
            }
        });
    });
}
generateMintAndATA().then(function () {
    console.log("Mint and ATA creation complete");
}).catch(function (error) {
    console.error("Error generating mint and ATA:", error);
});
