import express from 'express';

const router = express.Router();

router.get('/search', async (req, res) => {
    try {
        const query = req.query.q || 'discipline';
        const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(query)}`);
        const data = await response.json();
        const searchResults = data?.query?.search;
        if (searchResults && searchResults.length > 0) {
            // Remove HTML tags
            const snippet = searchResults[0].snippet.replace(/(<([^>]+)>)/gi, "");
            res.json({ result: "Oracle data retrieved: " + snippet });
        } else {
            res.json({ result: "No actionable intel found. Stay focused on the primary objective." });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Oracle connection failed." });
    }
});

export default router;
