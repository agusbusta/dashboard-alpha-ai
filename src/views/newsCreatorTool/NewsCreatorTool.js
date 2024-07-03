import React, { useState, useEffect } from "react";
import { Form, Button, Spinner, Alert } from "react-bootstrap";
import config from "../../config";
import TextExtractor from "../textExtractor/TextExtractor";
import "./NewsCreatorTool.css";

const NewsCreatorTool = () => {
  const [categories, setCategories] = useState([]);
  const [bots, setBots] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBot, setSelectedBot] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [usedKeywords, setUsedKeywords] = useState("");
  const [isArticleEfficient, setIsArticleEfficient] = useState("");
  const [isLoadingRegenerateArticle, setIsLoadingRegenerateArticle] =
    useState(false);
  const [isLoadingRegenerateImage, setIsLoadingRegenerateImage] =
    useState(false);
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [articleToBeSaved, setArticleToBeSaved] = useState(null);
  const [imageToBeSaved, setImageToBeSaved] = useState(null);

  useEffect(() => {
    const fetchCategoriesAndBots = async () => {
      try {
        const categoriesResponse = await fetch(
          `${config.BOTS_V2_API}/categories`,
        );
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData.data?.categories || []);

        const botsResponse = await fetch(`${config.BOTS_V2_API}/bots`);
        const botsData = await botsResponse.json();
        setBots(botsData.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setCategories([]);
        setBots([]);
      }
    };

    fetchCategoriesAndBots();
  }, []);

  const handleGenerate = async () => {
    setIsLoadingRegenerateArticle(true);
    try {
      const articleResponse = await fetch(
        `${config.BOTS_V2_API}/generate_article`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify({
            content: analysis,
            category_id: selectedCategory,
          }),
        },
      );

      const articleData = await articleResponse.json();
      if (!articleResponse.ok) {
        console.error("Error generating article:", articleData.error);
        return;
      }

      const imageResponse = await fetch(
        `${config.BOTS_V2_API}/generate_image`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify({
            content: articleData.data.content,
            bot_id: selectedBot,
          }),
        },
      );

      const imageData = await imageResponse.json();
      if (!imageResponse.ok) {
        console.error("Error generating image:", imageData.error);
        return;
      }

      setPreviewData({
        title: articleData.data.title,
        content: articleData.data.content,
        image: imageData.data.image_url,
      });
      setArticleToBeSaved({
        title: articleData.data.title,
        content: articleData.data.content,
        analysis: analysis,
        used_keywords: usedKeywords,
        is_article_efficient: isArticleEfficient,
        category_id: selectedCategory,
        bot_id: selectedBot,
      });
      setImageToBeSaved(imageData.data.image_url);

      setShowPreview(true);
    } catch (error) {
      console.error("Error generating article or image:", error.message);
    } finally {
      setIsLoadingRegenerateArticle(false);
      setIsLoadingRegenerateImage(false);
    }
  };

  const handleSave = async () => {
    setIsLoadingSave(true);
    try {
      const response = await fetch(`${config.BOTS_V2_API}/add_new_article`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          title: articleToBeSaved.title,
          content: articleToBeSaved.content,
          analysis: articleToBeSaved.analysis,
          used_keywords: articleToBeSaved.used_keywords,
          is_article_efficient: articleToBeSaved.is_article_efficient,
          category_id: articleToBeSaved.category_id,
          bot_id: articleToBeSaved.bot_id,
          image_url: imageToBeSaved,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setShowSuccessMessage(true); // Show success message
        console.log("Article saved successfully!");
        setTimeout(() => {
          setShowSuccessMessage(false); // Hide after 5 seconds
          startOver(); // Reset form after hiding success message
        }, 5000);
      } else {
        console.error("Error saving article:", data.message);
      }
    } catch (error) {
      console.error("Error saving article:", error.message);
    } finally {
      setIsLoadingSave(false);
    }
  };

  const handleRegenerateArticle = async () => {
    setIsLoadingRegenerateArticle(true);
    try {
      const articleResponse = await fetch(
        `${config.BOTS_V2_API}/generate_article`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify({
            content: analysis,
            category_id: selectedCategory,
          }),
        },
      );

      const articleData = await articleResponse.json();
      if (!articleResponse.ok) {
        console.error("Error regenerating article:", articleData.error);
        return;
      }

      setPreviewData((prevData) => ({
        ...prevData,
        title: articleData.data.title,
        content: articleData.data.content,
      }));
      setArticleToBeSaved((prevData) => ({
        ...prevData,
        title: articleData.data.title,
        content: articleData.data.content,
      }));
    } catch (error) {
      console.error("Error regenerating article:", error.message);
    } finally {
      setIsLoadingRegenerateArticle(false);
    }
  };

  const handleRegenerateImage = async () => {
    setIsLoadingRegenerateImage(true);
    try {
      const imageResponse = await fetch(
        `${config.BOTS_V2_API}/generate_image`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify({
            content: previewData.content,
            bot_id: selectedBot,
          }),
        },
      );

      const imageData = await imageResponse.json();
      if (!imageResponse.ok) {
        console.error("Error regenerating image:", imageData.error);
        return;
      }

      setPreviewData((prevData) => ({
        ...prevData,
        image: imageData.data.image_url,
      }));
      setImageToBeSaved(imageData.data.image_url);
    } catch (error) {
      console.error("Error regenerating image:", error.message);
    } finally {
      setIsLoadingRegenerateImage(false);
    }
  };

  const startOver = () => {
    setSelectedCategory("");
    setSelectedBot("");
    setAnalysis("");
    setUsedKeywords("");
    setIsArticleEfficient("");
    setPreviewData(null);
    setShowPreview(false);
    setArticleToBeSaved(null);
    setImageToBeSaved(null);
  };

  return (
    <div className="news-creator-tool">
      <h1>News Creator Tool</h1>
      <Form>
        <TextExtractor setAnalysis={setAnalysis} />
        <br />
        <Form.Group controlId="category">
          <Form.Label>Category</Form.Label>
          <Form.Control
            as="select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <br />
        <Form.Group controlId="bot">
          <Form.Label>Coin</Form.Label>
          <Form.Control
            as="select"
            value={selectedBot}
            onChange={(e) => setSelectedBot(e.target.value)}
          >
            <option value="">Select Coin</option>
            {bots.map((bot) => (
              <option key={bot.id} value={bot.id}>
                {bot.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <br />
        <Form.Group controlId="analysis">
          <Form.Label>Article Analysis</Form.Label>
          <Form.Control
            as="textarea"
            rows={15}
            value={analysis}
            onChange={(e) => setAnalysis(e.target.value)}
          />
        </Form.Group>
        <br />
        <Form.Group controlId="usedKeywords">
          <Form.Label>Used Keywords</Form.Label>
          <Form.Control
            type="text"
            value={usedKeywords}
            onChange={(e) => setUsedKeywords(e.target.value)}
          />
        </Form.Group>
        <br />
        <Form.Group controlId="isArticleEfficient">
          <Form.Label>Is Article Efficient</Form.Label>
          <Form.Control
            type="text"
            value={isArticleEfficient}
            onChange={(e) => setIsArticleEfficient(e.target.value)}
          />
        </Form.Group>
        <br />
        <Button
          variant="primary"
          onClick={handleGenerate}
          disabled={isLoadingRegenerateArticle || isLoadingRegenerateImage}
        >
          {isLoadingRegenerateArticle ? (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          ) : (
            "Create Article"
          )}
        </Button>
      </Form>
      <br />
      {showPreview && previewData && (
        <div className="preview-section">
          <h2>News Preview</h2>
          <br />
          {previewData.image && (
            <img
              src={previewData.image}
              style={{ width: "300px", height: "300px" }}
              alt="Generated"
            />
          )}
          <br />
          <br />
          <Button
            variant="secondary"
            onClick={handleRegenerateImage}
            disabled={isLoadingRegenerateImage}
          >
            {isLoadingRegenerateImage ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : (
              "Regenerate Image"
            )}
          </Button>
          <br />
          <br />
          <h3>{previewData.title}</h3>
          <p>{previewData.content}</p>
          <div className="button-group">
            <Button
              variant="secondary"
              onClick={handleRegenerateArticle}
              disabled={isLoadingRegenerateArticle}
            >
              {isLoadingRegenerateArticle ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                "Regenerate Article"
              )}
            </Button>
            <br />
            <br />
            <Button
              variant="success"
              onClick={handleSave}
              disabled={isLoadingSave}
            >
              {isLoadingSave ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                "Save"
              )}
            </Button>
            <Button
              variant="danger"
              style={{ marginLeft: "10px" }}
              onClick={startOver}
            >
              Start Over
            </Button>
            <br />
            <br />
          </div>
        </div>
      )}
      {showSuccessMessage && (
        <Alert variant="success" className="mt-3">
          Article created successfully!
        </Alert>
      )}
      <br />
      <br />
    </div>
  );
};

export default NewsCreatorTool;
