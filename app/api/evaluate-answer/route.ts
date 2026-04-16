export async function POST(req) {
  const { question, answer } = await req.json();

  return Response.json({
    score: 6,
    feedback:
      "Good attempt, but you should explain more clearly and add examples.",
  });
}
