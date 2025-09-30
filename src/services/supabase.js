import {createClient} from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Validate env vars early to provide clearer errors when missing
if (!supabaseUrl || !supabaseKey) {
    console.error(
        "[supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Set env vars in your .env and restart dev server."
    );
}

// Create a single client per browser context and disable realtime
const _global = typeof window !== "undefined" ? window : globalThis;
if (!_global.__supabase) {
    _global.__supabase = createClient(supabaseUrl, supabaseKey, {
        realtime: {enabled: false},
    });
    console.log("Supabase client initialized:", !!_global.__supabase); // Debug: should log true
}
export const supabase = _global.__supabase;

// Fetch all articles
export async function getArticles() {
    try {
        if (!supabaseUrl || !supabaseKey) throw new Error("Supabase env vars are not configured.");
        const {data, error} = await supabase.from("articles").select("*").order("created_at", {ascending: false});
        if (error) throw error;
        return data;
    } catch (err) {
        console.error("[getArticles] Error fetching articles:", err);
        throw err;
    }
}

// Fetch single article by slug
export async function getArticleBySlug(slug) {
    try {
        if (!supabaseUrl || !supabaseKey) throw new Error("Supabase env vars are not configured.");
        const {data, error} = await supabase.from("articles").select("*").eq("slug", slug).single();
        if (error) throw error;
        return data;
    } catch (err) {
        console.error(`[getArticleBySlug] Error fetching article (${slug}):`, err);
        throw err;
    }
}

// Add article (admin)
export async function addArticle(article) {
    const {data, error} = await supabase.from("articles").insert([article]);
    if (error) throw error;
    return data;
}

// Update article (admin)
export async function updateArticle(id, article) {
    const payload = {...article, updated_at: new Date().toISOString()};
    const {data, error} = await supabase.from("articles").update(payload).eq("id", id);
    if (error) throw error;
    return data;
}

// Delete article (admin)
export async function deleteArticle(id) {
    const {data, error} = await supabase.from("articles").delete().eq("id", id);
    if (error) throw error;
    return data;
}

// Upload image to Supabase storage
export async function uploadImage(file) {
    const fileName = `${Date.now()}-${file.name}`;
    const {data: uploadData, error: uploadError} = await supabase.storage.from("uploads").upload(fileName, file);
    if (uploadError) throw uploadError;
    const publicRes = supabase.storage.from("uploads").getPublicUrl(fileName);
    const publicUrl = publicRes?.data?.publicUrl ?? publicRes?.data?.publicURL ?? null;
    return publicUrl;
}

// Get requests (admin)
export async function getRequests() {
    const {data, error} = await supabase.from("requests").select("*").order("created_at", {ascending: false});
    if (error) throw error;
    return data;
}

// Update request status (approve/reject)
export async function updateRequestStatus(id, status) {
    const {data, error} = await supabase.from("requests").update({status}).eq("id", id);
    if (error) throw error;
    if (status === "approved") {
        const {data: reqData, error: reqError} = await supabase.from("requests").select("*").eq("id", id).single();
        if (reqError) throw reqError;
        const request = reqData;
        await addArticle({
            title: request.title,
            slug: (request.title || "").toLowerCase().replace(/\s+/g, "-"),
            excerpt: request.excerpt,
            content: request.content,
            image_path: request.image_path,
            author: request.submitter_email,
        });
    }
    return data;
}

// Convenience wrappers for Admin UI
export async function approveRequest(id) {
    return updateRequestStatus(id, "approved");
}

export async function rejectRequest(id) {
    return updateRequestStatus(id, "rejected");
}

// Delete a request (admin)
export async function deleteRequest(id) {
    const {data, error} = await supabase.from("requests").delete().eq("id", id);
    if (error) throw error;
    return data;
}

// Submit user request
export async function submitRequest(request) {
    const {data, error} = await supabase.from("requests").insert([request]);
    if (error) throw error;
    return data;
}

// Submit contact
export async function submitContact(contact) {
    const {data, error} = await supabase.from("contacts").insert([contact]);
    if (error) throw error;
    return data;
}

export default supabase;
