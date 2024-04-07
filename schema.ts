// Like the `config` function we use in keystone.ts, we use functions
// for putting in our config so we get useful errors. With typescript,
// we get these even before code runs.
import { list } from "@keystone-6/core";
import {
  text,
  relationship,
  password,
  timestamp,
  select,
  calendarDay,
} from "@keystone-6/core/fields";
import { document } from "@keystone-6/fields-document";
import { cloudinaryImage } from "@keystone-6/cloudinary";
import { allowAll } from "@keystone-6/core/access";

// We are using Typescript, and we want our types experience to be as strict as it can be.
// By providing the Keystone generated `Lists` type to our lists object, we refine
// our types to a stricter subset that is type-aware of other lists in our schema
// that Typescript cannot easily infer.
import { Lists } from ".keystone/types";

function buildSlug(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
}

const COLORS_OPTIONS = [
  { label: "Red", value: "red" },
  { label: "Gray", value: "gray" },
  { label: "Stone", value: "stone" },
  { label: "Orange", value: "orange" },
  { label: "Yellow", value: "yellow" },
  { label: "Green", value: "green" },
  { label: "Teal", value: "teal" },
  { label: "Sky", value: "sky" },
  { label: "Blue", value: "blue" },
  { label: "Purple", value: "purple" },
];

// We have a users list, a blogs list, and tags for blog posts, so they can be filtered.
// Each property on the exported object will become the name of a list (a.k.a. the `listKey`),
// with the value being the definition of the list, including the fields.
export const lists: Lists = {
  Spotify: list({
    access: allowAll,
    isSingleton: true,
    fields: {
      token: text(),
      refreshToken: text(),
    },
  }),
  // Here we define the user list.
  User: list({
    // Here are the fields that `User` will have. We want an email and password so they can log in
    // a name so we can refer to them, and a way to connect users to posts.
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      email: text({
        validation: { isRequired: true },
        isIndexed: "unique",
        isFilterable: true,
      }),
      // The password field takes care of hiding details and hashing values
      password: password({ validation: { isRequired: true } }),
      // Relationships allow us to reference other lists. In this case,
      // we want a user to have many posts, and we are saying that the user
      // should be referencable by the 'author' field of posts.
      // Make sure you read the docs to understand how they work: https://keystonejs.com/docs/guides/relationships#understanding-relationships
      posts: relationship({ ref: "Post.author", many: true }),
    },
    // Here we can configure the Admin UI. We want to show a user's name and posts in the Admin UI
    ui: {
      listView: {
        initialColumns: ["name", "posts"],
      },
    },
  }),
  // Our second list is the Posts list. We've got a few more fields here
  // so we have all the info we need for displaying posts.
  Post: list({
    access: allowAll,
    fields: {
      title: text({ validation: { isRequired: true } }),
      // Having the status here will make it easy for us to choose whether to display
      // posts on a live site.
      status: select({
        options: [
          { label: "Published", value: "published" },
          { label: "Draft", value: "draft" },
        ],
        // We want to make sure new posts start off as a draft when they are created
        defaultValue: "draft",
        // fields also have the ability to configure their appearance in the Admin UI
        ui: {
          displayMode: "segmented-control",
        },
      }),
      // The document field can be used for making highly editable content. Check out our
      // guide on the document field https://keystonejs.com/docs/guides/document-fields#how-to-use-document-fields
      // for more information
      content: document({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1],
        ],
        links: true,
        dividers: true,
      }),
      postedOn: timestamp({
        defaultValue: { kind: "now" },
      }),
      slug: text({
        isIndexed: "unique",
        isFilterable: true,
        ui: {
          createView: { fieldMode: "hidden" },
          itemView: { fieldMode: "read" },
        },
      }),
      // Here is the link from post => author.
      // We've configured its UI display quite a lot to make the experience of editing posts better.
      author: relationship({
        ref: "User.posts",
        ui: {
          displayMode: "cards",
          cardFields: ["name", "email"],
          inlineEdit: { fields: ["name", "email"] },
          linkToItem: true,
          inlineCreate: { fields: ["name", "email"] },
        },
      }),
      // We also link posts to tags. This is a many <=> many linking.
      tags: relationship({
        ref: "Tag.posts",
        ui: {
          displayMode: "cards",
          cardFields: ["name"],
          inlineEdit: { fields: ["name"] },
          linkToItem: true,
          inlineConnect: true,
          inlineCreate: { fields: ["name"] },
        },
        many: true,
      }),
    },
    hooks: {
      resolveInput: ({ resolvedData, operation, inputData }) => {
        const { title } = resolvedData;
        if (title) {
          return {
            ...resolvedData,
            // Ensure the first letter of the title is capitalised
            slug: buildSlug(title),
          };
        }
        // We always return resolvedData from the resolveInput hook
        return resolvedData;
      },
    },
  }),
  // Our final list is the tag list. This field is just a name and a relationship to posts
  Tag: list({
    access: allowAll,
    ui: {
      isHidden: false,
    },
    fields: {
      name: text(),
      posts: relationship({ ref: "Post.tags", many: true }),
    },
  }),
  Education: list({
    access: allowAll,
    fields: {
      title: text(),
      duration: text(),
      location: text(),
      cover_image: cloudinaryImage({
        cloudinary: {
          cloudName: process.env.CLOUDINARY_CLOUD_NAME,
          apiKey: process.env.CLOUDINARY_API_KEY,
          apiSecret: process.env.CLOUDINARY_API_SECRET,
          folder: process.env.CLOUDINARY_API_FOLDER,
        },
      }),
    },
  }),
  Experience: list({
    access: allowAll,
    fields: {
      title: text(),
      location: text(),
      type: text(), // should use select
      duration: text(),
      startDate: calendarDay({ db: { isNullable: true } }),
      endDate: calendarDay({ db: { isNullable: true } }),
      description: text({
        ui: {
          displayMode: "textarea",
        },
      }),
      cover_image: cloudinaryImage({
        cloudinary: {
          cloudName: process.env.CLOUDINARY_CLOUD_NAME,
          apiKey: process.env.CLOUDINARY_API_KEY,
          apiSecret: process.env.CLOUDINARY_API_SECRET,
          folder: process.env.CLOUDINARY_API_FOLDER,
        },
      }),
      technologies: relationship({
        ref: "Technology.experiences",
        ui: {
          displayMode: "cards",
          cardFields: ["name"],
          inlineEdit: { fields: ["name"] },
          linkToItem: true,
          inlineConnect: true,
          inlineCreate: { fields: ["name"] },
        },
        many: true,
      }),
    },
    hooks: {
      validateInput: ({
        resolvedData,
        addValidationError,
        inputData,
        item,
      }) => {
        const startDate = inputData.startDate; // TODO: FIX THE UPDATE SINGLE FIELD BUG
        const endDate = inputData.endDate;

        if (startDate && endDate && startDate > endDate) {
          addValidationError("The start date cannot be after the end date.");
        }
        if (!startDate && endDate) {
          addValidationError("Must provide start date if you have end date.");
        }
      },
    },
  }),
  Technology: list({
    access: allowAll,
    fields: {
      name: text(),
      experiences: relationship({ ref: "Experience.technologies" }),
      color: select({
        type: "enum",
        options: COLORS_OPTIONS,
      }),
    },
    hooks: {
      resolveInput: ({ resolvedData }) => {
        const { color } = resolvedData;
        if (!color) {
          return {
            ...resolvedData,
            color:
              COLORS_OPTIONS[Math.floor(Math.random() * COLORS_OPTIONS.length)]
                .value,
          };
        }
        // We always return resolvedData from the resolveInput hook
        return resolvedData;
      },
    },
  }),
};
