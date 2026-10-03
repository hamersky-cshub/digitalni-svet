import { getCollection, type CollectionEntry } from 'astro:content';

export async function getTopics(): Promise<CollectionEntry<'topics'>[]> {
  const topics = await getCollection('topics');
  return topics.sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title, 'cs'));
}

/** Materiály seřazené podle pořadí témat a pak abecedně. */
export async function getResources(): Promise<CollectionEntry<'resources'>[]> {
  const [topics, resources] = await Promise.all([getTopics(), getCollection('resources')]);
  const topicOrder = new Map(topics.map((t, i) => [t.id, i]));
  return resources.sort(
    (a, b) =>
      (topicOrder.get(a.data.topic.id) ?? 0) - (topicOrder.get(b.data.topic.id) ?? 0) ||
      a.data.title.localeCompare(b.data.title, 'cs'),
  );
}
