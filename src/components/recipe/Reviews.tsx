import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { addAReview, getReviewsByRecipeId } from "@/services/reviewService";
import type { Review } from "@/types/Review";
import SpinningLoader from "@/components/ui/loading";
import { useNavigate } from "react-router-dom";

type ReviewProps = {
  recipeId: number;
};

export default function Reviews({ recipeId }: ReviewProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [review, setReview] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [message, setMessage] = useState("");

  const fetchReviews = async () => {
    setIsLoading(true); // 🔁 Start loading
    try {
      const fetchedReviews: Review[] = await getReviewsByRecipeId(recipeId);
      setReviews(fetchedReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setIsLoading(false); // ✅ Done loading
    }
  };

  const handleSubmit = async () => {
    if (!review.trim()) {
      setMessage("Please enter a review before submitting.");
      return;
    }

    try {
      setSubmitting(true);
      setMessage("");

      await addAReview(user!, recipeId, review.trim());

      setReview("");
      setMessage("Review submitted successfully!");
      await fetchReviews(); // Refresh the review list
    } catch (err) {
      console.error("Error submitting review:", err);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [recipeId]);

  return (
    <div className="mt-6 p-4 border rounded-lg bg-white shadow-xl">
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[120px]">
          <SpinningLoader />
        </div>
      ) : (
        <>
          {/* Review Cards */}
          <div className="flex flex-col gap-4">
            <p className="text-lg font-semibold">What others are saying:</p>
            {reviews.length === 0 ? (
              <p className="text-gray-500 italic">No reviews yet.</p>
            ) : (
              reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-4 border rounded-md bg-gray-50 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-semibold text-mainGreen">
                      {review.userDisplayName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {(() => {
                        const timestamp = review.createdAt as any;
                        if (timestamp?.seconds) {
                          const jsDate = new Date(timestamp.seconds * 1000);
                          return (
                            <>
                              {jsDate.toLocaleDateString()}{" "}
                              {jsDate.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </>
                          );
                        } else {
                          return "Date not available";
                        }
                      })()}
                    </p>
                  </div>
                  <p className="text-gray-600 text-md ml-2">{review.review}</p>
                </div>
              ))
            )}
          </div>

          <br />

          {/* Leave a Review Section */}
          {!user ? (
            <div className="flex w-full justify-center">
              <button
                className="text-white bg-mainGreen italic cursor-pointer hover:bg-mainGreenHover p-2 rounded-md"
                onClick={() => navigate("/login")}
              >
                Login to leave a review.
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 mb-6">
              <label htmlFor="review" className="text-lg font-semibold">
                Leave a Review
              </label>
              <textarea
                id="review"
                className="border rounded-md p-2 resize-y min-h-[80px] max-h-[200px] focus:outline-mainGreen"
                placeholder="Share your thoughts about the recipe..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
              />
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="self-start bg-mainGreen hover:bg-mainGreenHover text-white px-4 py-2 rounded-md disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
              {message && <p className="text-sm text-gray-600">{message}</p>}
            </div>
          )}
        </>
      )}
    </div>
  );
}
