import {describe, expect, it} from "bun:test"
import axios from "axios";
import { BASE_URL } from "../config";
// supertest -> express


let base_url = BASE_URL;

describe("website ge ts created", ()=>{
    it("Website not created if url is not presented ", ()=>{
        try{
            axios.post(`${base_url}/api/v1/websites/website`,{

            });
            expect(false, "website created when it shouldn't")
        }catch(e){
             
        }
    }
)}
)