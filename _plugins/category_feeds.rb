# frozen_string_literal: true

module Jekyll
  class CategoryFeedPage < Page
    def initialize(site, base, category)
      @site = site
      @base = base
      @dir = "feed/categories/#{Jekyll::Utils.slugify(category)}"
      @name = "feed.xml"

      self.process(@name)
      self.read_yaml(File.join(base, "_layouts"), "category-feed.xml")
      self.data["category"] = category
      self.data["permalink"] = "/feed/categories/#{Jekyll::Utils.slugify(category)}/feed.xml"
    end
  end

  class CategoryFeedGenerator < Generator
    safe true
    priority :low

    def generate(site)
      categories = site.posts.docs.flat_map { |post| post.data["categories"] || [] }.uniq.compact

      categories.each do |category|
        next if category.nil? || category.empty?

        site.pages << CategoryFeedPage.new(site, site.source, category)
      end

      # Generate a category feed index page
      generate_feed_index(site, categories)
    end

    private

    def generate_feed_index(site, categories)
      # This creates data that can be used in templates
      site.data["category_feeds"] = categories.map do |category|
        {
          "name" => category,
          "slug" => Jekyll::Utils.slugify(category),
          "url" => "/feed/categories/#{Jekyll::Utils.slugify(category)}/feed.xml"
        }
      end.sort_by { |c| c["name"] }
    end
  end
end
