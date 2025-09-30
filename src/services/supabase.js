import {createClient} from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// single client export
export const supabase = createClient(supabaseUrl, supabaseKey);

// Fetch all articles
export async function getArticles() {
    const {data, error} = await supabase.from("articles").select("*").order("created_at", {ascending: false});
    if (error) throw error;
    return data;
}

// Fetch single article by slug
export async function getArticleBySlug(slug) {
    const {data, error} = await supabase.from("articles").select("*").eq("slug", slug).single();
    if (error) throw error;
    return data;
}

// Add article (admin)
export async function addArticle(article) {
    const {data, error} = await supabase.from("articles").insert([article]);
    if (error) throw error;
    return data;
}

// Update article (admin)
export async function updateArticle(id, article) {
    const {data, error} = await supabase.from("articles").update(article).eq("id", id);
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
    // accepts id (not whole request object)
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

// default export for compatibility
export default supabase;
