import * as Discord from "discord.js";
export module utils {
    /**
     * Resolves the Promise after the specified amount of milliseconds
     */
    export function sleep(ms: number): Promise<any>
    /**
     * Returns an embed for the type of error provided.
     */
    export function errorResponse(type: string, extraInfo: string): Discord.MessageEmbed
    /**
     * Returns the index of an element in an multi-dimensional array.
     */
    export function index(a: any, arr: Array<any>): number
    /**
     * Returns a formatted version of the time difference.
     */
    export function setupTimeDiff(diff: number): string
    /** 
    * Splits a string into parts of less than 1000 Characters in length.
    */
    export function splitString(str: string): Array<string>
    /**
     * Returns the local data.
     */
    export function getData(): Promise<JSON>
    /**
     * Returns the guild from the API.
     */
    export function getGuild(): Promise<JSON>
    /**
     * Returns the guild leaderboard from the API.
     */
    export function getGuildLeaderboard(): Promise<JSON>
    /**
     * Returns the player data from the API.
     */
    export function getPlayer(ign: string): Promise<JSON>
    /**
     * Changes the page of an embed.
     */
    export function changePage(message: Discord.Message, reaction: Discord.MessageReaction, user: Discord.User, color: string, title: string, field: Array<string>, currentIndex: number): void
}
